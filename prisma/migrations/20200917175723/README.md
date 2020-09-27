# Migration `20200917175723`

This migration has been generated by RubenZx at 9/17/2020, 7:57:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `ucalendar`.`Subject` ADD COLUMN `semester` boolean  NOT NULL DEFAULT true
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200915103814..20200917175723
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
@@ -51,8 +51,9 @@
 model Subject {
   id            Int             @id
   name          String
   abrev         String
+  semester      Boolean         @default(true)
   degrees       DegreeSubject[]
   timeTableItem TimeTableItem[]
   user          UserSubject[]
 }
```

