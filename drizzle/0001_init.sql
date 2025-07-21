CREATE TYPE "public"."ServiceType" AS ENUM('REGULAR', 'EXPRESS', 'FLASH');--> statement-breakpoint
CREATE TYPE "public"."PaymentStatus" AS ENUM('PENDING', 'DONE');--> statement-breakpoint
CREATE TYPE "public"."TransactionPaymentStatus" AS ENUM('UNPAID', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."TransactionStatus" AS ENUM('CHECK_IN', 'IN_PROCESS', 'FINISHED', 'CHECK_OUT');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"details" varchar,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" text,
	"createdAt" date DEFAULT now() NOT NULL,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CustomerContact" (
	"id" serial PRIMARY KEY NOT NULL,
	"customerId" integer NOT NULL,
	"contactId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserLaundry" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"laundryId" integer NOT NULL,
	"joinedDate" timestamp DEFAULT now() NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Laundry" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" text NOT NULL,
	"imageUrl" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LaundryConfig" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"name" varchar NOT NULL,
	"value" varchar NOT NULL,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LaundryContact" (
	"id" serial PRIMARY KEY NOT NULL,
	"laundryId" integer NOT NULL,
	"contactId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Currency" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"shortName" varchar NOT NULL,
	"symbol" varchar,
	"countryName" varchar NOT NULL,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "QuantityUnit" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"shortName" varchar NOT NULL,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"price" numeric DEFAULT '0.00' NOT NULL,
	"qtyUnitId" integer NOT NULL,
	"currencyId" integer NOT NULL,
	"serviceType" "ServiceType" DEFAULT 'REGULAR' NOT NULL,
	"laundryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"transactionNo" varchar NOT NULL,
	"customerId" integer NOT NULL,
	"locationId" integer,
	"userId" integer NOT NULL,
	"currencyId" integer NOT NULL,
	"checkInDate" timestamp with time zone DEFAULT now() NOT NULL,
	"proceedDate" timestamp with time zone,
	"finishedDate" timestamp with time zone,
	"checkOutDate" timestamp with time zone,
	"serviceType" "ServiceType" DEFAULT 'REGULAR' NOT NULL,
	"status" "TransactionStatus" DEFAULT 'CHECK_IN' NOT NULL,
	"paymentStatus" "TransactionPaymentStatus" DEFAULT 'UNPAID' NOT NULL,
	"receiptPath" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TransactionItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"transactionId" integer NOT NULL,
	"productId" integer NOT NULL,
	"qtyUnitId" integer NOT NULL,
	"description" varchar NOT NULL,
	"qty" numeric DEFAULT '1.00' NOT NULL,
	"price" numeric DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TransactionPayment" (
	"id" serial PRIMARY KEY NOT NULL,
	"transactionId" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"reference" varchar,
	"paymentMethod" varchar DEFAULT 'CASH' NOT NULL,
	"amount" numeric DEFAULT '0.00' NOT NULL,
	"status" "PaymentStatus" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Sequence" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"minDigits" integer,
	"currentSequence" integer DEFAULT 1 NOT NULL,
	"laundryId" integer
);
--> statement-breakpoint
ALTER TABLE "FacilityBookingItem" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityBookingPayment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityBooking" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ResponsibleSchema" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Responsible" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "SportCategory" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "SportFacilityDay" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "SportFacility" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "SportFacilityTime" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityPriceItemRule" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityPriceItem" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityPriceRuleDay" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityPriceRule" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityPriceRuleTime" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "FacilityPrice" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "SportCentreContact" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "SportCentre" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "FacilityBookingItem" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityBookingPayment" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityBooking" CASCADE;--> statement-breakpoint
DROP TABLE "ResponsibleSchema" CASCADE;--> statement-breakpoint
DROP TABLE "Responsible" CASCADE;--> statement-breakpoint
DROP TABLE "SportCategory" CASCADE;--> statement-breakpoint
DROP TABLE "SportFacilityDay" CASCADE;--> statement-breakpoint
DROP TABLE "SportFacility" CASCADE;--> statement-breakpoint
DROP TABLE "SportFacilityTime" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityPriceItemRule" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityPriceItem" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityPriceRuleDay" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityPriceRule" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityPriceRuleTime" CASCADE;--> statement-breakpoint
DROP TABLE "FacilityPrice" CASCADE;--> statement-breakpoint
DROP TABLE "SportCentreContact" CASCADE;--> statement-breakpoint
DROP TABLE "SportCentre" CASCADE;--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "User_centreId_SportCentre_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Contact" ADD CONSTRAINT "Contact_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer" ADD CONSTRAINT "Customer_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CustomerContact" ADD CONSTRAINT "CustomerContact_customerId_Customer_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CustomerContact" ADD CONSTRAINT "CustomerContact_contactId_Contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserLaundry" ADD CONSTRAINT "UserLaundry_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserLaundry" ADD CONSTRAINT "UserLaundry_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LaundryConfig" ADD CONSTRAINT "LaundryConfig_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LaundryContact" ADD CONSTRAINT "LaundryContact_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LaundryContact" ADD CONSTRAINT "LaundryContact_contactId_Contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Location" ADD CONSTRAINT "Location_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Currency" ADD CONSTRAINT "Currency_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "QuantityUnit" ADD CONSTRAINT "QuantityUnit_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Product" ADD CONSTRAINT "Product_qtyUnitId_QuantityUnit_id_fk" FOREIGN KEY ("qtyUnitId") REFERENCES "public"."QuantityUnit"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Product" ADD CONSTRAINT "Product_currencyId_Currency_id_fk" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Product" ADD CONSTRAINT "Product_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerId_Customer_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_locationId_Location_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_currencyId_Currency_id_fk" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_Transaction_id_fk" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_qtyUnitId_QuantityUnit_id_fk" FOREIGN KEY ("qtyUnitId") REFERENCES "public"."QuantityUnit"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TransactionPayment" ADD CONSTRAINT "TransactionPayment_transactionId_Transaction_id_fk" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Sequence" ADD CONSTRAINT "Sequence_laundryId_Laundry_id_fk" FOREIGN KEY ("laundryId") REFERENCES "public"."Laundry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "centreId";--> statement-breakpoint
ALTER TABLE "Role" ADD CONSTRAINT "Role_identifier_unique" UNIQUE("identifier");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");