"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks";

type Props = {
  providerUrl: string;
  text: string;
  image: string;
  disabled?: boolean;
  setDisabled: (disable: boolean) => void;
};

export function MsalSignInButton({
  providerUrl,
  text,
  image,
  disabled,
  setDisabled,
}: Props) {
  const { handleLoginB2C, isLoading } = useAuth();

  const onClick = async () => {
    setDisabled(true);
    try {
      await handleLoginB2C(providerUrl);
    } catch {
      toast.error("Login failed. Please try again.");
    }
    setDisabled(false);
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="bg-background text-foreground border-muted hover:bg-muted hover:text-foreground border transition-colors duration-200 ease-in-out"
    >
      <div className="flex items-center gap-2">
        <Image src={image} alt={text} width={20} height={20} />
        <span>{text}</span>
      </div>
    </Button>
  );
}
