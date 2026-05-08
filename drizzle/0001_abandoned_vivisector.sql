CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`canton` varchar(64) NOT NULL,
	`type` varchar(64) NOT NULL,
	`surface` int NOT NULL,
	`budget` varchar(64) NOT NULL,
	`delai` varchar(64) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`tel` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
