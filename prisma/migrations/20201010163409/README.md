# Migration `20201010163409`

This migration has been generated by RubenZx at 10/10/2020, 6:34:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `Message` ADD COLUMN `sentDate` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201010161428..20201010163409
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 enum Role {
   ALUMN
@@ -25,14 +25,15 @@
   messagesSent     Message[]            @relation("sentTo")
 }
 model Message {
-  id          Int    @id @default(autoincrement())
-  sentTo      User   @relation(fields: [sentToUid], references: [uid], name: "sentTo")
+  id          Int      @id @default(autoincrement())
+  content     String
+  sentDate    DateTime @default(now())
+  sentTo      User     @relation(fields: [sentToUid], references: [uid], name: "sentTo")
   sentToUid   String
-  sentFrom    User   @relation(fields: [sentFromUid], references: [uid], name: "sentFrom")
+  sentFrom    User     @relation(fields: [sentFromUid], references: [uid], name: "sentFrom")
   sentFromUid String
-  content     String
 }
 model Degree {
   id       Int             @id
```


