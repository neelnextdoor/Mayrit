-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS user_feature_flags;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS feature_flags;
DROP TABLE IF EXISTS password_reset_token;
DROP TABLE IF EXISTS users;

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
                         `email` varchar(255) NOT NULL,
                         `name` varchar(255) NOT NULL,
                         `password_hash` varchar(255) NOT NULL,
                         `is_active` tinyint NOT NULL DEFAULT '1',
                         `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                         `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                         `ref_id` varchar(255) NOT NULL DEFAULT '0',
                         `created_by` varchar(255) DEFAULT NULL,
                         `updated_by` varchar(255) DEFAULT NULL,
                         `id` bigint NOT NULL AUTO_INCREMENT,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `roles`
--
CREATE TABLE `roles` (
                         `id` bigint NOT NULL AUTO_INCREMENT,
                         `name` varchar(100) DEFAULT NULL,
                         `description` text,
                         `is_active` tinyint(1) DEFAULT '1',
                         `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         `ref_id` char(36) DEFAULT NULL,
                         `created_by` bigint DEFAULT NULL,
                         `updated_by` bigint DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `name` (`name`),
                         KEY `fk_roles_created_by` (`created_by`),
                         KEY `fk_roles_updated_by` (`updated_by`),
                         CONSTRAINT `fk_roles_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
                         CONSTRAINT `fk_roles_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `feature_flags`
--
CREATE TABLE `feature_flags` (
                                 `id` bigint NOT NULL AUTO_INCREMENT,
                                 `flag_key` varchar(100) NOT NULL,
                                 `description` text,
                                 `is_enabled_globally` tinyint(1) DEFAULT '0',
                                 PRIMARY KEY (`id`),
                                 UNIQUE KEY `flag_key` (`flag_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `permissions`
--
CREATE TABLE `permissions` (
                               `id` bigint NOT NULL AUTO_INCREMENT,
                               `name` varchar(100) DEFAULT NULL,
                               `code` varchar(100) DEFAULT NULL,
                               `description` text,
                               `is_active` tinyint(1) DEFAULT '1',
                               `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                               `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               `ref_id` char(36) DEFAULT NULL,
                               `created_by` bigint DEFAULT NULL,
                               `updated_by` bigint DEFAULT NULL,
                               PRIMARY KEY (`id`),
                               UNIQUE KEY `name` (`name`),
                               UNIQUE KEY `code` (`code`),
                               KEY `fk_permissions_updated_by` (`updated_by`),
                               KEY `fk_permissions_created_by` (`created_by`),
                               CONSTRAINT `fk_permissions_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `role_permissions`
--
CREATE TABLE `role_permissions` (
                                    `role_id` bigint NOT NULL,
                                    `permission_id` bigint NOT NULL,
                                    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    `created_by` bigint DEFAULT NULL,
                                    `updated_by` bigint DEFAULT NULL,
                                    PRIMARY KEY (`role_id`,`permission_id`),
                                    KEY `fk_rp_permission` (`permission_id`),
                                    KEY `fk_rp_created_by` (`created_by`),
                                    KEY `fk_rp_updated_by` (`updated_by`),
                                    CONSTRAINT `fk_rp_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
                                    CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                                    CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                                    CONSTRAINT `fk_rp_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `session`
--
CREATE TABLE `session` (
                           `id` bigint NOT NULL AUTO_INCREMENT,
                           `session_id` char(36) NOT NULL,
                           `user_id` bigint NOT NULL,
                           `role_id` bigint DEFAULT NULL,
                           `country_id` bigint DEFAULT NULL,
                           `is_active` tinyint(1) DEFAULT '1',
                           `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                           `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           `created_by` bigint DEFAULT NULL,
                           `updated_by` bigint DEFAULT NULL,
                           PRIMARY KEY (`id`),
                           KEY `fk_session_role` (`role_id`),
                           KEY `fk_session_created_by` (`created_by`),
                           KEY `fk_session_updated_by` (`updated_by`),
                           KEY `fk_session_user` (`user_id`),
                           CONSTRAINT `fk_session_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
                           CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `user_feature_flags`
--
CREATE TABLE `user_feature_flags` (
                                      `user_id` bigint NOT NULL,
                                      `feature_flag_id` bigint NOT NULL,
                                      `is_enabled` tinyint(1) DEFAULT '0',
                                      `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                                      `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      `created_by` bigint DEFAULT NULL,
                                      `updated_by` bigint DEFAULT NULL,
                                      PRIMARY KEY (`user_id`,`feature_flag_id`),
                                      KEY `fk_uff_feature_flag` (`feature_flag_id`),
                                      KEY `fk_uff_created_by` (`created_by`),
                                      KEY `fk_uff_updated_by` (`updated_by`),
                                      CONSTRAINT `fk_uff_feature_flag` FOREIGN KEY (`feature_flag_id`) REFERENCES `feature_flags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
                                      CONSTRAINT `fk_uff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `user_roles`
--
CREATE TABLE `user_roles` (
                              `user_id` bigint NOT NULL,
                              `role_id` bigint NOT NULL,
                              `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
                              `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              `created_by` varchar(255) DEFAULT NULL,
                              `updated_by` varchar(255) DEFAULT NULL,
                              PRIMARY KEY (`user_id`,`role_id`),
                              KEY `fk_role` (`role_id`),
                              CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
                              CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `password_reset_token`
--
CREATE TABLE `password_reset_token` (
                                        `id` int NOT NULL AUTO_INCREMENT,
                                        `token` varchar(255) NOT NULL,
                                        `expiresAt` datetime NOT NULL,
                                        `userId` bigint NOT NULL,
                                        PRIMARY KEY (`id`),
                                        KEY `FK_a4e53583f7a8ab7d01cded46a41` (`userId`),
                                        CONSTRAINT `FK_a4e53583f7a8ab7d01cded46a41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
