"use client";

import apiClient from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Pencil, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  image: string | null;
  createdAt: string;
};

type ProfileUpdate = {
  name: string;
  username: string;
  email: string;
  image?: string | null;
};

export default function ProfileEditDialog({ user }: { user: ProfileUser }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState<string | null>(user.image);
  const [imageChanged, setImageChanged] = useState(false);
  const [imageError, setImageError] = useState("");
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (profile: ProfileUpdate) =>
      apiClient("/api/users/profile", {
        method: "PATCH",
        body: profile,
      }),
    onSuccess: ({ user: updatedUser }: { user: ProfileUser }) => {
      queryClient.setQueryData(["profile"], (current) => {
        if (!current || typeof current !== "object") return current;
        return { ...current, user: updatedUser };
      });
      setOpen(false);
    },
  });

  const openEditor = () => {
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setImage(user.image);
    setImageChanged(false);
    setImageError("");
    updateProfile.reset();
    setOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setImageChanged(true);
      setImageError("");
    };
    reader.onerror = () => setImageError("Could not read this image.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const profile: ProfileUpdate = { name, username, email };
    if (imageChanged) profile.image = image;
    updateProfile.mutate(profile);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && setOpen(false)}>
      <Button
        type="button"
        onClick={openEditor}
        className="mt-4 w-fit cursor-pointer bg-[#01b4e4] text-white hover:bg-[#01b4e4]/80"
      >
        <Pencil />
        Edit profile
      </Button>

      <DialogContent className="border border-white/10 bg-[#032541] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Edit profile</DialogTitle>
          <DialogDescription className="text-white/60">
            Update the details shown on your profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            {image ? (
              <img
                src={image}
                alt="Profile preview"
                className="size-16 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-white/10 text-white/60">
                <UserRound />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Label htmlFor="profile-image" className="mb-2 block text-white/80">
                Profile photo
              </Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={updateProfile.isPending}
                className="h-auto border-white/15 bg-black/20 text-white file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-white"
              />
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImageChanged(true);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
                  disabled={updateProfile.isPending}
                >
                  <X size={14} /> Remove photo
                </button>
              )}
              {imageError && <p className="mt-1 text-sm text-red-300">{imageError}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-name" className="text-white/80">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              required
              disabled={updateProfile.isPending}
              className="border-white/15 bg-black/20 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-username" className="text-white/80">Username</Label>
            <Input
              id="profile-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={40}
              required
              disabled={updateProfile.isPending}
              className="border-white/15 bg-black/20 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profile-email" className="text-white/80">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
              disabled={updateProfile.isPending}
              className="border-white/15 bg-black/20 text-white"
            />
          </div>

          {updateProfile.isError && (
            <p role="alert" className="text-sm text-red-300">
              {updateProfile.error.message}
            </p>
          )}

          <DialogFooter className="border-white/10 bg-black/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfile.isPending || Boolean(imageError)}
              className="bg-[#01b4e4] text-white hover:bg-[#01b4e4]/80"
            >
              {updateProfile.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
