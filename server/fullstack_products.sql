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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text,
  `price` float DEFAULT NULL,
  `destination` varchar(100) DEFAULT NULL,
  `hotspots` json DEFAULT NULL,
  `lines` json DEFAULT NULL,
  `textBoxes` json DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `image_embedding` json DEFAULT NULL,
  `text_embedding` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'sdfghjk','',0,'Parts Category: Engine','[{\"x\": 24.46959089524675, \"y\": 49.09949376947039, \"id\": 1753239255690, \"price\": \"52\", \"style\": {\"color\": \"white\", \"backgroundColor\": \"#E21E27\"}, \"number\": 1, \"partName\": \"sdfghjkl\", \"quantity\": 1, \"partNumber\": \"dfghjkl-952\"}]','[]','[{\"x\": 37.906648886760195, \"y\": 7.043419003115256, \"id\": 1753239266511, \"price\": \"52\", \"partName\": \"sdfghjkl\", \"quantity\": 1, \"partNumber\": \"dfghjkl-952\", \"hotspotNumber\": 1}]','1753239270258-Screenshot 2025-04-25 140739.png','2025-07-23 10:54:30','2025-07-23 10:54:30',NULL,NULL),(2,'sdfghjkl','',0,'Parts Category: Engine','[{\"x\": 23.015123594460736, \"y\": 42.07529174147217, \"id\": 1753239430514, \"price\": \"41\", \"style\": {\"color\": \"white\", \"backgroundColor\": \"#E21E27\"}, \"number\": 1, \"partName\": \"gfd\", \"quantity\": 1, \"partNumber\": \"lkjhgf-9652\"}]','[]','[{\"x\": 51.2523636700751, \"y\": 24.12197037701975, \"id\": 1753239447233, \"price\": \"41\", \"partName\": \"gfd\", \"quantity\": 1, \"partNumber\": \"lkjhgf-9652\", \"hotspotNumber\": 1}]','1753239450500-Screenshot 2025-07-01 042252.png','2025-07-23 10:57:30','2025-07-23 10:57:30',NULL,NULL),(3,'xcvb','',0,'Parts Category: Engine','[{\"x\": 23.25141849049098, \"y\": 43.556438699444925, \"id\": 1753286656423, \"price\": \"234\", \"style\": {\"color\": \"white\", \"backgroundColor\": \"#E21E27\"}, \"number\": 1, \"partName\": \"zxcvbm\", \"quantity\": 1, \"partNumber\": \"sdfghjk-23456789\"}]','[]','[]','1753286674993-Screenshot 2025-07-01 042252.png','2025-07-24 00:04:34','2025-07-24 00:04:34',NULL,NULL),(4,'cvbnm','',0,'Parts Category: Engine','[]','[]','[]','1753811462904-Screenshot 2025-07-01 042252.png','2025-07-24 00:06:36','2025-07-30 01:51:02',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
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
