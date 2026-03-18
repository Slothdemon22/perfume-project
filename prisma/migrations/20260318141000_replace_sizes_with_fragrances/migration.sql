-- Replace apparel-oriented sizes with perfume fragrances array.
ALTER TABLE "Product" ADD COLUMN "fragrances" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing data from sizes to fragrances where available.
UPDATE "Product"
SET "fragrances" = COALESCE("sizes", ARRAY[]::TEXT[]);

ALTER TABLE "Product" DROP COLUMN "sizes";
