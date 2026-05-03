import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-evenly">
        <Button size={"lg"} variant={"ghost"}>
          <Image
            src={"/uz.svg"}
            alt="Uzbek"
            height={32}
            width={40}
            className="mr-4 rounded-md"
            style={{ width: "auto" }}
          />
          Uzbek
        </Button>

        <Button size={"lg"} variant={"ghost"}>
          <Image
            src={"/es.svg"}
            alt="Spanish"
            height={32}
            width={40}
            className="mr-4 rounded-md"
            style={{ width: "auto" }}
          />
          Spanish
        </Button>

        <Button size={"lg"} variant={"ghost"}>
          <Image
            src={"/fr.svg"}
            alt="French"
            height={32}
            width={40}
            className="mr-4 rounded-md"
            style={{ width: "auto" }}
          />
          French
        </Button>

        <Button size={"lg"} variant={"ghost"}>
          <Image
            src={"/it.svg"}
            alt="Italian"
            height={32}
            width={40}
            className="mr-4 rounded-md"
            style={{ width: "auto" }}
          />
          Italian
        </Button>

        <Button size={"lg"} variant={"ghost"}>
          <Image
            src={"/jp.svg"}
            alt="Japan"
            height={32}
            width={40}
            className="mr-4 rounded-md"
            style={{ width: "auto" }}
          />
          Japan
        </Button>
      </div>
    </footer>
  );
};
