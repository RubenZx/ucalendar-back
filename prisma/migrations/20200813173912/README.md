# Migration `20200813173912`

This migration has been generated by RubenZx at 8/13/2020, 5:39:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `ucalendar`.`TimeTableItem` DROP COLUMN `colorBgc`,
ADD COLUMN `colorBg` varchar(191) NOT NULL  ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200806171933..20200813173912
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
@@ -61,9 +61,9 @@
   startHour    String
   endHour      String
   type         String
   dayOfTheWeek Int
-  colorBgc     String
+  colorBg      String
   colorAbrev   String
   weeks        Json
   users        UserTimeTableItem[]
   timetables   TimeTableSubject[]
```


