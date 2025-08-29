Use ages;

drop table if exists users;

create table `ages`.`users`
(
    `id`                      binary(16)       not null primary key,
    `name`                    varchar(50)      not null,
    `email`                   varchar(50)      not null,
    `password`                varchar(120),
    `account_non_locked`      tinyint(1)       not null default 1,
    `account_non_expired`     tinyint(1)       not null default 1,
    `credentials_non_expired` tinyint(1)       not null default 1,
    `enabled`                 tinyint(1)       not null default 1,
    `credential_expiry_date`  DATE             not null,
    `account_expiry_date`     DATE             not null,
    `created_at`              datetime         not null default CURRENT_TIMESTAMP,
    `updated_at`              datetime         not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    `role_id`                 integer unsigned not null,
    unique key `uq_users_email` (`email`),
    unique key `uq_users_name` (`name`),
    constraint foreign key (`role_id`) references `ages`.`roles` (`role_id`) on delete restrict on update cascade
) engine = InnoDB
  default charset = utf8mb4;