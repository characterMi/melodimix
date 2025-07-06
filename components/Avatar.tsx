import { ChangeEvent, useRef, useState } from "react";
import { FaCamera, FaUser } from "react-icons/fa";
import Input from "./Input";

export const Avatar = ({
  avatarUrl,
  isSubmitting,
}: {
  avatarUrl: string | null;
  isSubmitting: boolean;
}) => {
  const [pickedImage, setPickedImage] = useState<string | null>(avatarUrl);
  const imageInput = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;

    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result as string | null);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <>
      <button
        className="size-44 flex items-center justify-center relative bg-emerald-600 outline-none transition-opacity hover:opacity-75 focus-visible:opacity-75 rounded-full"
        onClick={() => {
          if (isSubmitting) return;
          imageInput.current?.click();
        }}
        type="button"
        aria-label="Change your profile picture"
      >
        {pickedImage ? (
          <img
            src={pickedImage}
            alt={
              avatarUrl === pickedImage
                ? "Your current profile picture"
                : "an image picked by you"
            }
            className="rounded-full size-44 object-cover"
          />
        ) : (
          <FaUser
            size={86}
            className="text-white"
            aria-label="No image picked"
          />
        )}

        <div
          className="absolute -bottom-2 -right-2 border-[5px] border-neutral-800 rounded-full p-4 bg-emerald-600"
          aria-hidden
        >
          <FaCamera size={24} className="text-white" />
        </div>
      </button>

      <Input
        ref={imageInput}
        name="avatar"
        disabled={isSubmitting}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        aria-hidden
      />
    </>
  );
};
