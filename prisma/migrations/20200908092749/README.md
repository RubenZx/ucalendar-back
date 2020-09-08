# Migration `20200908092749`

This migration has been generated by RubenZx at 9/8/2020, 11:27:49 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `ucalendar`.`UserSubject` (
`userId` varchar(191) NOT NULL ,
`subjectId` int NOT NULL ,
PRIMARY KEY (`userId`,`subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `ucalendar`.`UserSubject` ADD FOREIGN KEY (`userId`) REFERENCES `ucalendar`.`User`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `ucalendar`.`UserSubject` ADD FOREIGN KEY (`subjectId`) REFERENCES `ucalendar`.`Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `ucalendar`.`ClassRoom` RENAME INDEX `ClassRoom.name` TO `ClassRoom.name_unique`

ALTER TABLE `ucalendar`.`Group` RENAME INDEX `Group.name` TO `Group.name_unique`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200813173912..20200908092749
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
@@ -20,15 +20,16 @@
   subjects TimeTableSubject[]
 }
 model User {
-  uid       String              @id
-  password  String
-  name      String?
-  lastName  String?
-  role      Role                @default(ALUMN)
-  timeTable TimeTable?
-  subjects  UserTimeTableItem[]
+  uid         String              @id
+  password    String
+  name        String?
+  lastName    String?
+  role        Role                @default(ALUMN)
+  timeTable   TimeTable?
+  subjects    UserTimeTableItem[]
+  UserSubject UserSubject[]
 }
 model Degree {
   id       Int             @id
@@ -53,8 +54,9 @@
   name          String
   abrev         String
   degrees       DegreeSubject[]
   timeTableItem TimeTableItem[]
+  UserSubject   UserSubject[]
 }
 model TimeTableItem {
   id           Int                 @default(autoincrement()) @id
@@ -75,8 +77,16 @@
   subjectId    Int
   @@unique([classRoomId, dayOfTheWeek, startHour, endHour], name: "onlyOneClassRoom")
 }
+model UserSubject {
+  user      User    @relation(fields: [userId], references: [uid])
+  userId    String
+  subject   Subject @relation(fields: [subjectId], references: [id])
+  subjectId Int
+  @@id([userId, subjectId])
+}
+
 model DegreeSubject {
   degree    Degree  @relation(fields: [degreeId], references: [id])
   degreeId  Int
   subject   Subject @relation(fields: [subjectId], references: [id])
```

