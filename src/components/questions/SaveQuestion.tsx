"use client";

import { toggleSaveCollection } from "@/lib/actions/collection.action";
import handleError from "@/lib/handlers/error";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.error("You must be logged in to save a question");
    }

    setIsLoading(true);
    try {
      const { success, data, error } = await toggleSaveCollection({
        questionId,
      });
      if (!success) throw handleError(error);
      toast.success(
        `Question ${data?.saved ? "saved to" : "removed from"} collection`
      );
      setIsLoading(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hasSaved = false;
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={cn("cursor-pointer", isLoading && "opacity-50")}
      aria-label="save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
