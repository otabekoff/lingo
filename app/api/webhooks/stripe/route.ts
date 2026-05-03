import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { stripe } from "@/lib/stripe";
import { userSubscription } from "@/db/schema";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Webhook error: ${message}`, {
            status: 400,
        });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.subscription) {
            return new NextResponse("Subscription ID is required", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Defensive check for current_period_end (Dahlia flexible billing structure)
        const sub = subscription as unknown as {
            current_period_end?: number;
            items?: { data?: { current_period_end?: number }[] }
        };
        let currentPeriodEnd = sub.current_period_end;

        // Fallback for Dahlia version where it might be in items
        if (!currentPeriodEnd && sub.items?.data?.[0]?.current_period_end) {
            currentPeriodEnd = sub.items.data[0].current_period_end;
        }

        if (typeof currentPeriodEnd !== "number") {
            console.error("Missing or invalid current_period_end in subscription:", JSON.stringify(subscription, null, 2));
            return new NextResponse("Invalid subscription data: missing current_period_end", { status: 500 });
        }

        await db.insert(userSubscription).values({
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const session = event.data.object as Stripe.Invoice;
        const invoice = session as unknown as {
            subscription?: string;
            subscription_id?: string;
            parent?: { subscription_details?: { subscription?: string } }
        };
        const subscriptionId = invoice.subscription
            || invoice.subscription_id
            || invoice.parent?.subscription_details?.subscription;

        if (!subscriptionId) {
            console.error("Missing subscription ID in invoice:", JSON.stringify(session, null, 2));
            return new NextResponse("Subscription ID is required", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Defensive check for current_period_end (Dahlia flexible billing structure)
        const sub = subscription as unknown as {
            current_period_end?: number;
            items?: { data?: { current_period_end?: number }[] }
        };
        let currentPeriodEnd = sub.current_period_end;

        // Fallback for Dahlia version where it might be in items
        if (!currentPeriodEnd && sub.items?.data?.[0]?.current_period_end) {
            currentPeriodEnd = sub.items.data[0].current_period_end;
        }

        if (typeof currentPeriodEnd !== "number") {
            console.error("Missing or invalid current_period_end in subscription:", JSON.stringify(subscription, null, 2));
            return new NextResponse("Invalid subscription data: missing current_period_end", { status: 500 });
        }

        await db.update(userSubscription).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
        }).where(eq(userSubscription.stripeSubscriptionId, subscription.id))
    }

    return new NextResponse(null, { status: 200 });
}