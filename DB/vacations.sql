-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2019 at 12:36 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `userID` int(11) NOT NULL,
  `vacationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`userID`, `vacationID`) VALUES
(3, 96),
(3, 129),
(7, 96),
(7, 128),
(7, 129);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `isLogged` tinyint(1) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `userName`, `firstName`, `lastName`, `isLogged`, `isAdmin`, `password`) VALUES
(1, 'admin', 'admin', 'admin', 0, 1, 'admin'),
(2, 'idiots', 'idiots', 'idiots', 0, 0, 'idiots'),
(3, 'Register', 'Register', 'Register', 1, 0, 'Register'),
(4, 'ranbarilan', 'ran', 'barilan', 0, 0, 'ranbarilan'),
(5, 'ranran', 'ranran', 'ranran', 0, 0, 'ranran'),
(6, 'abcde', 'abcde', 'abcde', 1, 0, 'abcde'),
(7, 'marrine', 'Marrine', 'Takeshorse', 1, 0, 'marrine');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationID` int(11) NOT NULL,
  `location` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `imageName` varchar(200) NOT NULL,
  `begin` date NOT NULL,
  `end` date NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationID`, `location`, `description`, `imageName`, `begin`, `end`, `price`) VALUES
(96, 'Milano , Italy', 'Italy, a European country with a long Mediterranean coast. Fashion Capital of the world and a very tourist friendly place.', '5d48e7e36c33d9b14f7beb0933007375.jpg', '2019-11-11', '2019-11-20', 2000),
(97, 'Maui, Hawaii', 'Hawaii is a state of the United States of America. It is the only state located in the Pacific Ocean and the only state composed entirely of islands. The state encompasses nearly the entire Hawaiian a', 'd39b24bd256cfcd6772ce1a1313613c3.jpg', '2019-10-12', '2019-10-22', 50000),
(125, 'New York, USA', 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial a', 'ec153ade38211e3479eaeb28680f4d5a.jpg', '2019-11-14', '2019-11-23', 32423),
(128, 'Sao Paulo,Brazil', 'Brazil Sao Paulo is a very large blah blah place in blah blah brazil a very blah blah country', '0b6f57e161b12556ebf9001c2cd4b148.jpg', '2019-11-10', '2019-11-19', 20000),
(129, 'Istanbul, Turkey', 'Istanbul is a major city in Turkey that straddles Europe and Asia across the Bosphorus Strait. Its Old City reflects cultural influences of the many empires that once ruled here. In the Sultanahmet di', '3117176dd7be3986a3022aec221f249a.jpg', '2019-11-12', '2019-11-21', 32423);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `userID` (`userID`,`vacationID`),
  ADD KEY `vacationID` (`vacationID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationID`) REFERENCES `vacations` (`vacationID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
