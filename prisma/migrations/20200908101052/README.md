# Migration `20200908101052`

This migration has been generated by RubenZx at 9/8/2020, 12:10:52 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200908092749..20200908101052
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
@@ -20,16 +20,16 @@
   subjects TimeTableSubject[]
 }
 model User {
-  uid         String              @id
-  password    String
-  name        String?
-  lastName    String?
-  role        Role                @default(ALUMN)
-  timeTable   TimeTable?
-  subjects    UserTimeTableItem[]
-  UserSubject UserSubject[]
+  uid               String              @id
+  password          String
+  name              String?
+  lastName          String?
+  role              Role                @default(ALUMN)
+  timeTable         TimeTable?
+  subjects          UserSubject[]
+  UserTimeTableItem UserTimeTableItem[]
 }
 model Degree {
   id       Int             @id
```

