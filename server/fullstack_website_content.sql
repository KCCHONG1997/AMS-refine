-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fullstack
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `website_content`
--

DROP TABLE IF EXISTS `website_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `website_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `featuredText` varchar(255) DEFAULT NULL,
  `aboutText` text,
  `missionText` text,
  `contact` text,
  `page` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page` (`page`),
  UNIQUE KEY `page_2` (`page`),
  UNIQUE KEY `page_3` (`page`),
  UNIQUE KEY `page_4` (`page`),
  UNIQUE KEY `page_5` (`page`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `website_content`
--

LOCK TABLES `website_content` WRITE;
/*!40000 ALTER TABLE `website_content` DISABLE KEYS */;
INSERT INTO `website_content` VALUES (1,'Where Quality Parts Meet Outstanding Service.','','Your trusted partner for quality automotive parts and accessories.','Welcome to AMS','AMS has been serving customers with top-quality automotive parts for years. We pride ourselves on offering a wide range of parts for multiple brands while providing excellent customer service.','','','home','2025-07-23 10:39:51','2025-07-23 10:39:51'),(2,'About AMS','','','','At Auto Machinery Singapore, we believe in keeping vehicles running at their best with reliable, high-performance parts. Our commitment to quality, affordability, and customer service has made us a trusted name in Singapores automotive parts industry.','Our mission is to be Singapores go-to source for reliable, competitively priced automotive parts. Whether you are performing routine maintenance or a complete overhaul, we are committed to delivering the right parts at the right time without compromising on quality.','','about','2025-07-23 10:39:51','2025-07-23 10:39:51'),(3,'','','','','','','','contact','2025-07-23 10:39:51','2025-07-23 10:39:51');
/*!40000 ALTER TABLE `website_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-03  3:58:29
