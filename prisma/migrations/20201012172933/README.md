# Migration `20201012172933`

This migration has been generated by RubenZx at 10/12/2020, 7:29:33 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201012172614..20201012172933
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
@@ -34,9 +34,9 @@
   sentFrom      User     @relation(fields: [sentFromUid], references: [uid], name: "sentFrom")
   sentFromUid   String
   parentMessage Message? @relation(fields: [parentId], references: [id], name: "parent")
   parentId      Int?
-  message       Message  @relation("parent")
+  message       Message? @relation("parent")
 }
 model Degree {
   id       Int             @id
```


