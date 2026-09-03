PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_phrase` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`phrase` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_phrase`("id", "slug", "title", "phrase") SELECT "id", "slug", "title", "phrase" FROM `phrase`;--> statement-breakpoint
DROP TABLE `phrase`;--> statement-breakpoint
ALTER TABLE `__new_phrase` RENAME TO `phrase`;--> statement-breakpoint
CREATE UNIQUE INDEX `phrase_slug_unique` ON `phrase` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "user_id", "expires_at") SELECT "id", "user_id", "expires_at" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE TABLE `__new_song` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`lyrics` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_song`("id", "slug", "title", "lyrics") SELECT "id", "slug", "title", "lyrics" FROM `song`;--> statement-breakpoint
DROP TABLE `song`;--> statement-breakpoint
ALTER TABLE `__new_song` RENAME TO `song`;--> statement-breakpoint
CREATE UNIQUE INDEX `song_slug_unique` ON `song` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "password_hash") SELECT "id", "username", "password_hash" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `__new_word` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_word`("id", "slug") SELECT "id", "slug" FROM `word`;--> statement-breakpoint
DROP TABLE `word`;--> statement-breakpoint
ALTER TABLE `__new_word` RENAME TO `word`;--> statement-breakpoint
CREATE UNIQUE INDEX `word_slug_unique` ON `word` (`slug`);--> statement-breakpoint
PRAGMA foreign_keys=ON;
