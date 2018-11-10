-- Author: Timothy Liu
-- Class: CS340_400_F2018

SET sql_notes = 0;
SET foreign_key_checks = 0;

--
-- Table structure for table `whosit`
--

DROP TABLE IF EXISTS `whosit`;

CREATE TABLE `whosit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `home` int(11) NOT NULL,
  `destiny` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Dumping sample data for table `whosit`
--

INSERT INTO `whosit` VALUES (1,'Who1',1,1),(2,'Who2',2,2),(3,'Who3',3,3);

--
-- Table structure for table `whatsit`
--

DROP TABLE IF EXISTS `whatsit`;

CREATE TABLE `whatsit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `importance` int(11) NOT NULL DEFAULT 0 CHECK(importance BETWEEN 0 AND 100),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

--
-- Dumping sample data for table `whatsit`
--

INSERT INTO `whatsit` VALUES (1,'Corn grower',70),(2,'Chicken breeder',75),(3,'Tree waterer',100);

--
-- Table structure for table `wheresit`
--

DROP TABLE IF EXISTS `wheresit`;

CREATE TABLE `wheresit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `temperature` int(11) DEFAULT 50 CHECK(`temperature` BETWEEN 0 AND 100),
  PRIMARY KEY(`id`)
) ENGINE=InnoDB;

--
-- Dumping data for table `wheresit`
--

INSERT INTO `wheresit` VALUES (1,'Place1',10),(2,'Place2',20),(3,'Place3',30);

--
-- Table structure for table `whysit`
--

DROP TABLE IF EXISTS `whysit`;

CREATE TABLE `whysit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB;

--
-- Dumping sample data for table `whysit`
--

INSERT INTO `whysit` VALUES (1,'Save the world'),(2,'Go to space'),(3,'Destroy the world');

--
-- Table structure for table `howsit`
--

DROP TABLE IF EXISTS `howsit`;

CREATE TABLE `howsit` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `emotion` varchar(20) NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB;

--
-- Dumping sample data for table `howsit`
--

INSERT INTO `howsit` VALUES (1,'happy'),(2,'conflicted'),(3,'ecstatic');

--
-- Table structure for table `has_a`
--

DROP TABLE IF EXISTS `has_a`;

CREATE TABLE `has_a` (
    `whosit_id` int(11) NOT NULL,
    `whatsit_id` int(11) NOT NULL,
    PRIMARY KEY (`whosit_id`, `whatsit_id`),
    CONSTRAINT fk_has_a
        FOREIGN KEY (`whosit_id`) 
        REFERENCES `whosit` (`id`)
        ON DELETE CASCADE,
        FOREIGN KEY (`whatsit_id`) 
        REFERENCES `whatsit` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Dumping sample data for table `has_a`
--

INSERT INTO `has_a` VALUES (3,3),(2,2),(1,3),(1,2),(1,1);

--
-- Table structure for table `feels_a`
--

DROP TABLE IF EXISTS `feels_a`;

CREATE TABLE `feels_a` (
    `whosit_id` int(11) NOT NULL,
    `howsit_id` int(11) NOT NULL,
    PRIMARY KEY (`whosit_id`, `howsit_id`),
    CONSTRAINT fk_feels_a
        FOREIGN KEY (`whosit_id`) 
        REFERENCES `whosit` (`id`)
        ON DELETE CASCADE,
        FOREIGN KEY (`howsit_id`) 
        REFERENCES `howsit` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Dumping sample data for table `feels_a`
--

INSERT INTO `feels_a` VALUES (1,3),(2,1),(3,2);

--
-- Adding foreign keys to table `whosit`
--

-- ALTER TABLE `whosit` ADD FOREIGN KEY (`home`) REFERENCES `wheresit` (`id`) ON DELETE CASCADE;
ALTER TABLE `whosit` 
ADD CONSTRAINT fk_who_where
    FOREIGN KEY (`home`)
    REFERENCES `wheresit` (`id`)
    ON DELETE CASCADE;
-- ALTER TABLE `whosit` ADD FOREIGN KEY (`destiny`) REFERENCES `whysit` (`id`) ON DELETE CASCADE;
ALTER TABLE `whosit`
ADD CONSTRAINT fk_who_why
    FOREIGN KEY (`destiny`)
    REFERENCES `whysit` (`id`)
    ON DELETE CASCADE;

SET sql_notes = 1;
SET foreign_key_checks = 1;
