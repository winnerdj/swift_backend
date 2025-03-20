CREATE DATABASE IF NOT EXISTS `swift_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_bin;

USE `swift_db`;

CREATE TABLE IF NOT EXISTS `bas_quick_code` (
	`qc_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_type` VARCHAR(25) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_code` VARCHAR(24) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_alternative_code1` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_alternative_code2` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_alternative_code3` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_desc` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`qc_status` TINYINT(1) NULL DEFAULT '1',
	`qc_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`qc_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`qc_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`qc_id`) USING BTREE,
	UNIQUE INDEX `compositeIndex` (`qc_type`, `qc_code`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;

CREATE TABLE IF NOT EXISTS `bas_role` (
	`role_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`role_name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_bin',
	`role_description` VARCHAR(255) NULL COLLATE 'utf8mb4_bin',
	`role_status` TINYINT(1) NULL DEFAULT '1',
	`role_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`role_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`role_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`role_id`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;

CREATE TABLE IF NOT EXISTS `bas_role_access` (
	`role_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`module_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`role_access_status` TINYINT(1) NULL DEFAULT '1',
	`role_access_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`role_access_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`role_access_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`role_id`, `module_id` ) USING BTREE,
    FOREIGN KEY (`role_id`) REFERENCES bas_role (`role_id`),
    FOREIGN KEY (`module_id`) REFERENCES bas_quick_code (`qc_id`),
	UNIQUE INDEX `compositeIndex` (`role_id`, `module_id`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;

CREATE TABLE IF NOT EXISTS `bas_user` (
	`user_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`user_role` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_bin',
	`user_password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`user_status` TINYINT(1) NULL DEFAULT '1',
	`user_name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_email` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_first_name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_middle_name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_last_name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_contact_person` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_contact_no` BIGINT NULL DEFAULT NULL,
	`user_address` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`user_id`) USING BTREE,
    FOREIGN KEY (`user_role`) REFERENCES bas_role (`role_id`),
	UNIQUE INDEX `user_email` (`user_email`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;

CREATE TABLE IF NOT EXISTS `bas_user_location` (
	`uuid` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`user_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`user_location` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`user_location_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_location_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`user_location_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`uuid`) USING BTREE,
    FOREIGN KEY (`user_id`) REFERENCES bas_user (`user_id`),
    FOREIGN KEY (`user_location`) REFERENCES bas_quick_code (`qc_id`),
    UNIQUE INDEX `compositeIndex` (`user_id`, `user_location`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;

CREATE TABLE IF NOT EXISTS `bas_service` (
	`service_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`service_location` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`service_name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`service_status` TINYINT(1) NULL DEFAULT '1',
	`service_description` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_bin',
	`service_discipline` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`no_of_counters` INT NOT NULL DEFAULT 1,
	`counter_prefix` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`ticket_number_prefix` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`recall_waiting_flag` TINYINT(1) NULL DEFAULT '1',
	`recall_waiting_time` INT NOT NULL DEFAULT 5,
	`service_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`service_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`service_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`service_id`) USING BTREE,
    FOREIGN KEY (`service_location`) REFERENCES bas_quick_code (`qc_id`),
	UNIQUE INDEX `uniq_counter_prefix` (`counter_prefix`) USING BTREE,
	UNIQUE INDEX `uniq_ticket_number_prefix` (`ticket_number_prefix`) USING BTREE,
	UNIQUE INDEX `uniq_service_location` (`service_name`, `service_location`) USING BTREE
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;

CREATE TABLE IF NOT EXISTS `doc_ticket_transaction_log` (
	`ticket_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',
	`ticket_service` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_bin',

	`ticket_status` VARCHAR(3) NOT NULL DEFAULT '00' COLLATE 'utf8mb4_bin',
	`ticket_issue_datetime` DATETIME(6) NOT NULL,

	`ticket_level` TINYINT(1) NOT NULL DEFAULT '1',
    `ticket_parent_reference` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
    `ticket_head_reference` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
    
	`ticket_counter` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
	`ticket_support` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
    
	`ticket_create_datetime` DATETIME(6) NOT NULL,
	`ticket_queue_datetime` DATETIME(6) NULL,
	`ticket_assigned_datetime` DATETIME(6) NULL,
	`ticket_now_serving_datetime` DATETIME(6) NULL,
	`ticket_served_datetime` DATETIME(6) NULL,
	`ticket_no_show_datetime` DATETIME(6) NULL,
	`ticket_cancelled_datetime` DATETIME(6) NULL,
	`ticket_reason_code` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
    
	`ticket_trip_number` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
	`ticket_trucker_id` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
	`ticket_trucker_name` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
	`ticket_vehicle_type` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
	`ticket_plate_num` VARCHAR(50) NULL COLLATE 'utf8mb4_bin',
    
	`ticket_remarks1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`ticket_remarks2` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`ticket_remarks3` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`createdAt` DATETIME(6) NOT NULL,
	`updatedBy` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_bin',
	`updatedAt` DATETIME(6) NULL DEFAULT NULL,
	PRIMARY KEY (`ticket_id`) USING BTREE,
    FOREIGN KEY (`ticket_service`) REFERENCES bas_service (`service_id`),
    FOREIGN KEY (`ticket_support`) REFERENCES bas_user (`user_id`)
)
COLLATE='utf8mb4_bin'
ENGINE=InnoDB
;
