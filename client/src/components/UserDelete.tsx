import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "#components/ui/dialog";
import { apiFetch } from "../utils/auth";
import { API } from "../utils/api";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setPassword("");
      setDeleteError(null);
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null);

    if (!password) {
      setDeleteError("Password is required");
      return;
    }

    setDeleting(true);
    try {
      const res = await apiFetch(API.users.base(), {
        method: "DELETE",
        credentials: "include", 
        // lets the browser accept the Set-Cookie header that clears refreshToken 
        // (not needed to send it — auth here is via Bearer token)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.status === 401) {
        setDeleteError("Incorrect password");
        return;
      }
      if (!res.ok) {
        setDeleteError("Something went wrong. Please try again.");
        return;
      }

      localStorage.clear();
      onOpenChange(false);
      navigate("/");
    } catch (err) {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. Enter your
            password to confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-password">Password</Label>
          <Input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}