Use ages;

drop table if exists `ages`.`roles`;

create table `ages`.`roles`
(
    `role_id`   integer unsigned not null auto_increment primary key,
    `role_name` varchar(20)      not null,
    UNIQUE KEY `uq_role_name` (`role_name`)
) engine = InnoDB DEFAULT CHARSET=utf8mb4;