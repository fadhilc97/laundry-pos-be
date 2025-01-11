CREATE TABLE IF NOT EXISTS "FacilityBookingItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"amount" numeric DEFAULT '0.00' NOT NULL,
	"facilityId" integer NOT NULL,
	"bookingId" integer NOT NULL,
	"selectedTimeId" integer NOT NULL,
	"selectedDate" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityBookingPayment" (
	"id" serial PRIMARY KEY NOT NULL,
	"method" varchar NOT NULL,
	"amount" numeric DEFAULT '0.00' NOT NULL,
	"bookingId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityBooking" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdDate" date DEFAULT now() NOT NULL,
	"bookingStatus" varchar NOT NULL,
	"paymentStatus" varchar NOT NULL,
	"responsibleId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResponsibleSchema" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"detail" varchar NOT NULL,
	"responsibleId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Responsible" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdDate" date DEFAULT now() NOT NULL,
	"centreId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SportCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SportFacilityDay" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"dayIndex" integer DEFAULT 0 NOT NULL,
	"facilityId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SportFacility" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"capacity" integer DEFAULT 0 NOT NULL,
	"categoryId" integer NOT NULL,
	"centreId" integer NOT NULL,
	"priceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SportFacilityTime" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"startTime" time NOT NULL,
	"endTime" time NOT NULL,
	"facilityId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityPriceItemRule" (
	"id" serial PRIMARY KEY NOT NULL,
	"priceItemId" integer NOT NULL,
	"priceRuleId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityPriceItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"price" numeric DEFAULT '0.00' NOT NULL,
	"priceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityPriceRuleDay" (
	"id" serial PRIMARY KEY NOT NULL,
	"priceRuleId" integer NOT NULL,
	"dayId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityPriceRule" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityPriceRuleTime" (
	"id" serial PRIMARY KEY NOT NULL,
	"priceRuleId" integer NOT NULL,
	"timeId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FacilityPrice" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"centreId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"identifier" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserRole" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"roleId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"imageUrl" varchar,
	"centreId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SportCentreContact" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"detail" varchar NOT NULL,
	"centreId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SportCentre" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityBookingItem" ADD CONSTRAINT "FacilityBookingItem_facilityId_SportFacility_id_fk" FOREIGN KEY ("facilityId") REFERENCES "public"."SportFacility"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityBookingItem" ADD CONSTRAINT "FacilityBookingItem_bookingId_FacilityBooking_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."FacilityBooking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityBookingItem" ADD CONSTRAINT "FacilityBookingItem_selectedTimeId_SportFacilityTime_id_fk" FOREIGN KEY ("selectedTimeId") REFERENCES "public"."SportFacilityTime"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityBookingPayment" ADD CONSTRAINT "FacilityBookingPayment_bookingId_FacilityBooking_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."FacilityBooking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityBooking" ADD CONSTRAINT "FacilityBooking_responsibleId_Responsible_id_fk" FOREIGN KEY ("responsibleId") REFERENCES "public"."Responsible"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ResponsibleSchema" ADD CONSTRAINT "ResponsibleSchema_responsibleId_Responsible_id_fk" FOREIGN KEY ("responsibleId") REFERENCES "public"."Responsible"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_centreId_SportCentre_id_fk" FOREIGN KEY ("centreId") REFERENCES "public"."SportCentre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SportFacilityDay" ADD CONSTRAINT "SportFacilityDay_facilityId_SportFacility_id_fk" FOREIGN KEY ("facilityId") REFERENCES "public"."SportFacility"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SportFacility" ADD CONSTRAINT "SportFacility_categoryId_SportCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."SportCategory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SportFacility" ADD CONSTRAINT "SportFacility_centreId_SportCentre_id_fk" FOREIGN KEY ("centreId") REFERENCES "public"."SportCentre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SportFacility" ADD CONSTRAINT "SportFacility_priceId_FacilityPrice_id_fk" FOREIGN KEY ("priceId") REFERENCES "public"."FacilityPrice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SportFacilityTime" ADD CONSTRAINT "SportFacilityTime_facilityId_SportFacility_id_fk" FOREIGN KEY ("facilityId") REFERENCES "public"."SportFacility"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceItemRule" ADD CONSTRAINT "FacilityPriceItemRule_priceItemId_FacilityPriceItem_id_fk" FOREIGN KEY ("priceItemId") REFERENCES "public"."FacilityPriceItem"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceItemRule" ADD CONSTRAINT "FacilityPriceItemRule_priceRuleId_FacilityPriceRule_id_fk" FOREIGN KEY ("priceRuleId") REFERENCES "public"."FacilityPriceRule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceItem" ADD CONSTRAINT "FacilityPriceItem_priceId_FacilityPrice_id_fk" FOREIGN KEY ("priceId") REFERENCES "public"."FacilityPrice"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceRuleDay" ADD CONSTRAINT "FacilityPriceRuleDay_priceRuleId_FacilityPriceRule_id_fk" FOREIGN KEY ("priceRuleId") REFERENCES "public"."FacilityPriceRule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceRuleDay" ADD CONSTRAINT "FacilityPriceRuleDay_dayId_SportFacilityDay_id_fk" FOREIGN KEY ("dayId") REFERENCES "public"."SportFacilityDay"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceRuleTime" ADD CONSTRAINT "FacilityPriceRuleTime_priceRuleId_FacilityPriceRule_id_fk" FOREIGN KEY ("priceRuleId") REFERENCES "public"."FacilityPriceRule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPriceRuleTime" ADD CONSTRAINT "FacilityPriceRuleTime_timeId_SportFacilityTime_id_fk" FOREIGN KEY ("timeId") REFERENCES "public"."SportFacilityTime"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FacilityPrice" ADD CONSTRAINT "FacilityPrice_centreId_SportCentre_id_fk" FOREIGN KEY ("centreId") REFERENCES "public"."SportCentre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_Role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_centreId_SportCentre_id_fk" FOREIGN KEY ("centreId") REFERENCES "public"."SportCentre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SportCentreContact" ADD CONSTRAINT "SportCentreContact_centreId_SportCentre_id_fk" FOREIGN KEY ("centreId") REFERENCES "public"."SportCentre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
