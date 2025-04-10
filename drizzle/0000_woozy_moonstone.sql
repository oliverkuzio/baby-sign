CREATE TABLE `phrase` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`phrase` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `phrase_slug_unique` ON `phrase` (`slug`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `song` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`lyrics` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `song_slug_unique` ON `song` (`slug`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `word` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `word_slug_unique` ON `word` (`slug`);--> statement-breakpoint
CREATE TABLE `words_to_phrases` (
	`word_id` text NOT NULL,
	`phrase_id` text NOT NULL,
	PRIMARY KEY(`word_id`, `phrase_id`),
	FOREIGN KEY (`word_id`) REFERENCES `word`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`phrase_id`) REFERENCES `phrase`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `words_to_songs` (
	`word_id` text NOT NULL,
	`song_id` text NOT NULL,
	PRIMARY KEY(`word_id`, `song_id`),
	FOREIGN KEY (`word_id`) REFERENCES `word`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`song_id`) REFERENCES `song`(`id`) ON UPDATE no action ON DELETE no action
);
