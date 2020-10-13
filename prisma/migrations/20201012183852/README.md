# Migration `20201012183852`

This migration has been generated by RubenZx at 10/12/2020, 8:38:52 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `Message` DROP FOREIGN KEY `Message_ibfk_3`

ALTER TABLE `Message` DROP FOREIGN KEY `Message_ibfk_2`

ALTER TABLE `Message` DROP FOREIGN KEY `Message_ibfk_1`

ALTER TABLE `Message` DROP COLUMN `sentToUid`,
    DROP COLUMN `sentFromUid`,
    DROP COLUMN `parentId`,
    ADD COLUMN `threadId` int  NOT NULL ,
    ADD COLUMN `userUid` varchar(191)  NOT NULL 

ALTER TABLE `User` ADD COLUMN `threadId` int  

CREATE TABLE `Thread` (
`id` int  NOT NULL  AUTO_INCREMENT,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `Message` ADD FOREIGN KEY (`threadId`) REFERENCES `ucalendar`.`Thread`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `Message` ADD FOREIGN KEY (`userUid`) REFERENCES `ucalendar`.`User`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `User` ADD FOREIGN KEY (`threadId`) REFERENCES `ucalendar`.`Thread`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201012172933..20201012183852
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
@@ -13,30 +13,34 @@
   ADMINISTRATOR
 }
 model User {
-  uid              String               @id
-  password         String
-  name             String?
-  lastName         String?
-  role             Role                 @default(ALUMN)
-  subjects         UserSubject[]
-  timetableItems   UserTimetableItems[]
-  messagesReceived Message[]            @relation("sentFrom")
-  messagesSent     Message[]            @relation("sentTo")
+  uid            String               @id
+  password       String
+  name           String?
+  lastName       String?
+  role           Role                 @default(ALUMN)
+  subjects       UserSubject[]
+  timetableItems UserTimetableItems[]
+  Thread         Thread?              @relation(fields: [threadId], references: [id])
+  threadId       Int?
+  Message        Message[]
 }
+model Thread {
+  id       Int       @id @default(autoincrement())
+  messages Message[]
+  users    User[]
+}
+
 model Message {
-  id            Int      @id @default(autoincrement())
-  content       String
-  sentDate      DateTime @default(now())
-  sentTo        User     @relation(fields: [sentToUid], references: [uid], name: "sentTo")
-  sentToUid     String
-  sentFrom      User     @relation(fields: [sentFromUid], references: [uid], name: "sentFrom")
-  sentFromUid   String
-  parentMessage Message? @relation(fields: [parentId], references: [id], name: "parent")
-  parentId      Int?
-  message       Message? @relation("parent")
+  id         Int      @id @default(autoincrement())
+  content    String
+  sentDate   DateTime @default(now())
+  Thread     Thread   @relation(fields: [threadId], references: [id])
+  threadId   Int
+  sentByUser User     @relation(fields: [userUid], references: [uid])
+  userUid    String
 }
 model Degree {
   id       Int             @id
```

