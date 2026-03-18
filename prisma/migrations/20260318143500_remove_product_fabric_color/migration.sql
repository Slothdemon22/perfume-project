-- Remove legacy product fields no longer used by admin/backend.
ALTER TABLE "Product" DROP COLUMN IF EXISTS "fabric";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "color";
