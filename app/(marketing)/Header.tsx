import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  Show,
  SignInButton,
  // SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="mx-auto flex h-full items-center justify-between lg:max-w-5xl">
        <div className="flex items-center gap-x-3 pt-8 pb-7 pl-4">
          <Image src={"/mascot.svg"} height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            Lingo
          </h1>
        </div>

        <ClerkLoading>
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <Show when="signed-out">
            <SignInButton
              mode="modal"
              fallbackRedirectUrl="/learn"
              signUpFallbackRedirectUrl="/learn"
            >
              <Button size="lg" variant={"ghost"}>
                Sign In
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </ClerkLoaded>
      </div>
    </header>
  );
};
