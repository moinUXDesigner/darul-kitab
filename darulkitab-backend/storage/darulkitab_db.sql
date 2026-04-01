-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jan 08, 2026 at 03:19 AM
-- Server version: 10.11.15-MariaDB-ubu2204
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `darulkitab_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `aayaat`
--

CREATE TABLE `aayaat` (
  `id` int(11) NOT NULL,
  `filepath` varchar(500) DEFAULT NULL,
  `filename` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aayaat`
--

INSERT INTO `aayaat` (`id`, `filepath`, `filename`) VALUES
(1, 'qurantafseer/001-Al-Fatihah.mp3', '001-Al-Fatihah.mp3'),
(2, 'qurantafseer/002-Al-Baqara 001-5.mp3', '002-Al-Baqara 001-5.mp3'),
(3, 'qurantafseer/002-Al-Baqara 006-20.mp3', '002-Al-Baqara 006-20.mp3'),
(4, 'qurantafseer/002-Al-Baqara 021-24.mp3', '002-Al-Baqara 021-24.mp3'),
(5, 'qurantafseer/002-Al-Baqara 025-29.mp3', '002-Al-Baqara 025-29.mp3'),
(6, 'qurantafseer/002-Al-Baqara 030-39.mp3', '002-Al-Baqara 030-39.mp3'),
(7, 'qurantafseer/002-Al-Baqara 040-46.mp3', '002-Al-Baqara 040-46.mp3'),
(8, 'qurantafseer/002-Al-Baqara 047-59.mp3', '002-Al-Baqara 047-59.mp3'),
(9, 'qurantafseer/002-Al-Baqara 060-61.mp3', '002-Al-Baqara 060-61.mp3'),
(10, 'qurantafseer/002-Al-Baqara 062-82.mp3', '002-Al-Baqara 062-82.mp3'),
(11, 'qurantafseer/002-Al-Baqara 083-91.mp3', '002-Al-Baqara 083-91.mp3'),
(12, 'qurantafseer/002-Al-Baqara 092-108.mp3', '002-Al-Baqara 092-108.mp3'),
(13, 'qurantafseer/002-Al-Baqara 109-117.mp3', '002-Al-Baqara 109-117.mp3'),
(14, 'qurantafseer/002-Al-Baqara 118-120.mp3', '002-Al-Baqara 118-120.mp3'),
(15, 'qurantafseer/002-Al-Baqara 121-128.mp3', '002-Al-Baqara 121-128.mp3'),
(16, 'qurantafseer/002-Al-Baqara 129-135.mp3', '002-Al-Baqara 129-135.mp3'),
(17, 'qurantafseer/002-Al-Baqara 136-141.mp3', '002-Al-Baqara 136-141.mp3'),
(18, 'qurantafseer/002-Al-Baqara 142-143.mp3', '002-Al-Baqara 142-143.mp3'),
(19, 'qurantafseer/002-Al-Baqara 144-152.mp3', '002-Al-Baqara 144-152.mp3'),
(20, 'qurantafseer/002-Al-Baqara 153-158.mp3', '002-Al-Baqara 153-158.mp3'),
(21, 'qurantafseer/002-Al-Baqara 159-167.mp3', '002-Al-Baqara 159-167.mp3'),
(22, 'qurantafseer/002-Al-Baqara 168-176.mp3', '002-Al-Baqara 168-176.mp3'),
(23, 'qurantafseer/002-Al-Baqara 177-182.mp3', '002-Al-Baqara 177-182.mp3'),
(24, 'qurantafseer/002-Al-Baqara 183-187.mp3', '002-Al-Baqara 183-187.mp3'),
(25, 'qurantafseer/002-Al-Baqara 187-188.mp3', '002-Al-Baqara 187-188.mp3'),
(26, 'qurantafseer/002-Al-Baqara 189-196.mp3', '002-Al-Baqara 189-196.mp3'),
(27, 'qurantafseer/002-Al-Baqara 197-210.mp3', '002-Al-Baqara 197-210.mp3'),
(28, 'qurantafseer/002-Al-Baqara 211-215.mp3', '002-Al-Baqara 211-215.mp3'),
(29, 'qurantafseer/002-Al-Baqara 215-217.mp3', '002-Al-Baqara 215-217.mp3'),
(30, 'qurantafseer/002-Al-Baqara 217-221.mp3', '002-Al-Baqara 217-221.mp3'),
(31, 'qurantafseer/002-Al-Baqara 222-228.mp3', '002-Al-Baqara 222-228.mp3'),
(32, 'qurantafseer/002-Al-Baqara 229-233.mp3', '002-Al-Baqara 229-233.mp3'),
(33, 'qurantafseer/002-Al-Baqara 234-242.mp3', '002-Al-Baqara 234-242.mp3'),
(34, 'qurantafseer/002-Al-Baqara 243-252.mp3', '002-Al-Baqara 243-252.mp3'),
(35, 'qurantafseer/002-Al-Baqara 253-254.mp3', '002-Al-Baqara 253-254.mp3'),
(36, 'qurantafseer/002-Al-Baqara 255.mp3', '002-Al-Baqara 255.mp3'),
(37, 'qurantafseer/002-Al-Baqara 256-257.mp3', '002-Al-Baqara 256-257.mp3'),
(38, 'qurantafseer/002-Al-Baqara 258-261.mp3', '002-Al-Baqara 258-261.mp3'),
(39, 'qurantafseer/002-Al-Baqara 262-267.mp3', '002-Al-Baqara 262-267.mp3'),
(40, 'qurantafseer/002-Al-Baqara 268-274.mp3', '002-Al-Baqara 268-274.mp3'),
(41, 'qurantafseer/002-Al-Baqara 275-281.mp3', '002-Al-Baqara 275-281.mp3'),
(42, 'qurantafseer/002-Al-Baqara 282-283.mp3', '002-Al-Baqara 282-283.mp3'),
(43, 'qurantafseer/002-Al-Baqara 284-286.mp3', '002-Al-Baqara 284-286.mp3'),
(44, 'qurantafseer/003-Al-Imran 001-9.mp3', '003-Al-Imran 001-9.mp3'),
(45, 'qurantafseer/003-Al-Imran 010-18.mp3', '003-Al-Imran 010-18.mp3'),
(46, 'qurantafseer/003-Al-Imran 019-27.mp3', '003-Al-Imran 019-27.mp3'),
(47, 'qurantafseer/003-Al-Imran 028-32.mp3', '003-Al-Imran 028-32.mp3'),
(48, 'qurantafseer/003-Al-Imran 033-47.mp3', '003-Al-Imran 033-47.mp3'),
(49, 'qurantafseer/003-Al-Imran 048-71.mp3', '003-Al-Imran 048-71.mp3'),
(50, 'qurantafseer/003-Al-Imran 072-80.mp3', '003-Al-Imran 072-80.mp3'),
(51, 'qurantafseer/003-Al-Imran 081-91.mp3', '003-Al-Imran 081-91.mp3'),
(52, 'qurantafseer/003-Al-Imran 092-97.mp3', '003-Al-Imran 092-97.mp3'),
(53, 'qurantafseer/003-Al-Imran 098-109.mp3', '003-Al-Imran 098-109.mp3'),
(54, 'qurantafseer/003-Al-Imran 110-120.mp3', '003-Al-Imran 110-120.mp3'),
(55, 'qurantafseer/003-Al-Imran 121-129.mp3', '003-Al-Imran 121-129.mp3'),
(56, 'qurantafseer/003-Al-Imran 130-151.mp3', '003-Al-Imran 130-151.mp3'),
(57, 'qurantafseer/003-Al-Imran 152-155.mp3', '003-Al-Imran 152-155.mp3'),
(58, 'qurantafseer/003-Al-Imran 156-164.mp3', '003-Al-Imran 156-164.mp3'),
(59, 'qurantafseer/003-Al-Imran 165-171.mp3', '003-Al-Imran 165-171.mp3'),
(60, 'qurantafseer/003-Al-Imran 172-180.mp3', '003-Al-Imran 172-180.mp3'),
(61, 'qurantafseer/003-Al-Imran 181-190.mp3', '003-Al-Imran 181-190.mp3'),
(62, 'qurantafseer/003-Al-Imran 187-200.mp3', '003-Al-Imran 187-200.mp3'),
(63, 'qurantafseer/004-An-Nisa 001-3.mp3', '004-An-Nisa 001-3.mp3'),
(64, 'qurantafseer/004-An-Nisa 004-14.mp3', '004-An-Nisa 004-14.mp3'),
(65, 'qurantafseer/004-An-Nisa 015-22.mp3', '004-An-Nisa 015-22.mp3'),
(66, 'qurantafseer/004-An-Nisa 023-28.mp3', '004-An-Nisa 023-28.mp3'),
(67, 'qurantafseer/004-An-Nisa 029-33.mp3', '004-An-Nisa 029-33.mp3'),
(68, 'qurantafseer/004-An-Nisa 034-38.mp3', '004-An-Nisa 034-38.mp3'),
(69, 'qurantafseer/004-An-Nisa 041-46.mp3', '004-An-Nisa 041-46.mp3'),
(70, 'qurantafseer/004-An-Nisa 047-57.mp3', '004-An-Nisa 047-57.mp3'),
(71, 'qurantafseer/004-An-Nisa 058-70.mp3', '004-An-Nisa 058-70.mp3'),
(72, 'qurantafseer/004-An-Nisa 071-79.mp3', '004-An-Nisa 071-79.mp3'),
(73, 'qurantafseer/004-An-Nisa 080-87.mp3', '004-An-Nisa 080-87.mp3'),
(74, 'qurantafseer/004-An-Nisa 088-93.mp3', '004-An-Nisa 088-93.mp3'),
(75, 'qurantafseer/004-An-Nisa 094-101.mp3', '004-An-Nisa 094-101.mp3'),
(76, 'qurantafseer/004-An-Nisa 101-104.mp3', '004-An-Nisa 101-104.mp3'),
(77, 'qurantafseer/004-An-Nisa 105-115.mp3', '004-An-Nisa 105-115.mp3'),
(78, 'qurantafseer/004-An-Nisa 116-118.mp3', '004-An-Nisa 116-118.mp3'),
(79, 'qurantafseer/004-An-Nisa 119-126.mp3', '004-An-Nisa 119-126.mp3'),
(80, 'qurantafseer/004-An-Nisa 127-134.mp3', '004-An-Nisa 127-134.mp3'),
(81, 'qurantafseer/004-An-Nisa 135-147.mp3', '004-An-Nisa 135-147.mp3'),
(82, 'qurantafseer/004-An-Nisa 148-162.mp3', '004-An-Nisa 148-162.mp3'),
(83, 'qurantafseer/004-An-Nisa 163-171.mp3', '004-An-Nisa 163-171.mp3'),
(84, 'qurantafseer/004-An-Nisa 172-176.mp3', '004-An-Nisa 172-176.mp3'),
(85, 'qurantafseer/005-Al-Maida 001-3.mp3', '005-Al-Maida 001-3.mp3'),
(86, 'qurantafseer/005-Al-Maida 003-5.mp3', '005-Al-Maida 003-5.mp3'),
(87, 'qurantafseer/005-Al-Maida 006-11.mp3', '005-Al-Maida 006-11.mp3'),
(88, 'qurantafseer/005-Al-Maida 012-19.mp3', '005-Al-Maida 012-19.mp3'),
(89, 'qurantafseer/005-Al-Maida 020-26.mp3', '005-Al-Maida 020-26.mp3'),
(90, 'qurantafseer/005-Al-Maida 027-34.mp3', '005-Al-Maida 027-34.mp3'),
(91, 'qurantafseer/005-Al-Maida 035-40.mp3', '005-Al-Maida 035-40.mp3'),
(92, 'qurantafseer/005-Al-Maida 041-45.mp3', '005-Al-Maida 041-45.mp3'),
(93, 'qurantafseer/005-Al-Maida 046-53.mp3', '005-Al-Maida 046-53.mp3'),
(94, 'qurantafseer/005-Al-Maida 054-59.mp3', '005-Al-Maida 054-59.mp3'),
(95, 'qurantafseer/005-Al-Maida 057-66.mp3', '005-Al-Maida 057-66.mp3'),
(96, 'qurantafseer/005-Al-Maida 067-77.mp3', '005-Al-Maida 067-77.mp3'),
(97, 'qurantafseer/005-Al-Maida 078-86.mp3', '005-Al-Maida 078-86.mp3'),
(98, 'qurantafseer/005-Al-Maida 087-92.mp3', '005-Al-Maida 087-92.mp3'),
(99, 'qurantafseer/005-Al-Maida 093-100.mp3', '005-Al-Maida 093-100.mp3'),
(100, 'qurantafseer/005-Al-Maida 101-108.mp3', '005-Al-Maida 101-108.mp3'),
(101, 'qurantafseer/005-Al-Maida 109-120.mp3', '005-Al-Maida 109-120.mp3'),
(102, 'qurantafseer/006-Al-Anam 001-6.mp3', '006-Al-Anam 001-6.mp3'),
(103, 'qurantafseer/006-Al-Anam 007-20.mp3', '006-Al-Anam 007-20.mp3'),
(104, 'qurantafseer/006-Al-Anam 021-41.mp3', '006-Al-Anam 021-41.mp3'),
(105, 'qurantafseer/006-Al-Anam 042-55.mp3', '006-Al-Anam 042-55.mp3'),
(106, 'qurantafseer/006-Al-Anam 056-64.mp3', '006-Al-Anam 056-64.mp3'),
(107, 'qurantafseer/006-Al-Anam 065-70.mp3', '006-Al-Anam 065-70.mp3'),
(108, 'qurantafseer/006-Al-Anam 071-83.mp3', '006-Al-Anam 071-83.mp3'),
(109, 'qurantafseer/006-Al-Anam 084-93.mp3', '006-Al-Anam 084-93.mp3'),
(110, 'qurantafseer/006-Al-Anam 093-101.mp3', '006-Al-Anam 093-101.mp3'),
(111, 'qurantafseer/006-Al-Anam 102-110.mp3', '006-Al-Anam 102-110.mp3'),
(112, 'qurantafseer/006-Al-Anam 111-122.mp3', '006-Al-Anam 111-122.mp3'),
(113, 'qurantafseer/006-Al-Anam 123-128.mp3', '006-Al-Anam 123-128.mp3'),
(114, 'qurantafseer/006-Al-Anam 129-137.mp3', '006-Al-Anam 129-137.mp3'),
(115, 'qurantafseer/006-Al-Anam 138-143.mp3', '006-Al-Anam 138-143.mp3'),
(116, 'qurantafseer/006-Al-Anam 144-151.mp3', '006-Al-Anam 144-151.mp3'),
(117, 'qurantafseer/006-Al-Anam 152.mp3', '006-Al-Anam 152.mp3'),
(118, 'qurantafseer/006-Al-Anam 153-155.mp3', '006-Al-Anam 153-155.mp3'),
(119, 'qurantafseer/006-Al-Anam 156-159.mp3', '006-Al-Anam 156-159.mp3'),
(120, 'qurantafseer/006-Al-Anam 160-166.mp3', '006-Al-Anam 160-166.mp3'),
(121, 'qurantafseer/007-Al-Araf 001-10.mp3', '007-Al-Araf 001-10.mp3'),
(122, 'qurantafseer/007-Al-Araf 011-25.mp3', '007-Al-Araf 011-25.mp3'),
(123, 'qurantafseer/007-Al-Araf 026-31.mp3', '007-Al-Araf 026-31.mp3'),
(124, 'qurantafseer/007-Al-Araf 032-39.mp3', '007-Al-Araf 032-39.mp3'),
(125, 'qurantafseer/007-Al-Araf 040-47.mp3', '007-Al-Araf 040-47.mp3'),
(126, 'qurantafseer/007-Al-Araf 048-53.mp3', '007-Al-Araf 048-53.mp3'),
(127, 'qurantafseer/007-Al-Araf 054-56.mp3', '007-Al-Araf 054-56.mp3'),
(128, 'qurantafseer/007-Al-Araf 057-64.mp3', '007-Al-Araf 057-64.mp3'),
(129, 'qurantafseer/007-Al-Araf 065-79.mp3', '007-Al-Araf 065-79.mp3'),
(130, 'qurantafseer/007-Al-Araf 073-85.mp3', '007-Al-Araf 073-85.mp3'),
(131, 'qurantafseer/007-Al-Araf 085-93.mp3', '007-Al-Araf 085-93.mp3'),
(132, 'qurantafseer/007-Al-Araf 094-102.mp3', '007-Al-Araf 094-102.mp3'),
(133, 'qurantafseer/007-Al-Araf 103-129.mp3', '007-Al-Araf 103-129.mp3'),
(134, 'qurantafseer/007-Al-Araf 130-141.mp3', '007-Al-Araf 130-141.mp3'),
(135, 'qurantafseer/007-Al-Araf 142-149.mp3', '007-Al-Araf 142-149.mp3'),
(136, 'qurantafseer/007-Al-Araf 150-157.mp3', '007-Al-Araf 150-157.mp3'),
(137, 'qurantafseer/007-Al-Araf 158-162.mp3', '007-Al-Araf 158-162.mp3'),
(138, 'qurantafseer/007-Al-Araf 163-171.mp3', '007-Al-Araf 163-171.mp3'),
(139, 'qurantafseer/007-Al-Araf 172-176.mp3', '007-Al-Araf 172-176.mp3'),
(140, 'qurantafseer/007-Al-Araf 177-200.mp3', '007-Al-Araf 177-200.mp3'),
(141, 'qurantafseer/007-Al-Araf 201-206.mp3', '007-Al-Araf 201-206.mp3'),
(142, 'qurantafseer/008-Al-Anfal 001-10.mp3', '008-Al-Anfal 001-10.mp3'),
(143, 'qurantafseer/008-Al-Anfal 011-19.mp3', '008-Al-Anfal 011-19.mp3'),
(144, 'qurantafseer/008-Al-Anfal 020-28.mp3', '008-Al-Anfal 020-28.mp3'),
(145, 'qurantafseer/008-Al-Anfal 029-37.mp3', '008-Al-Anfal 029-37.mp3'),
(146, 'qurantafseer/008-Al-Anfal 037-44.mp3', '008-Al-Anfal 037-44.mp3'),
(147, 'qurantafseer/008-Al-Anfal 045-48.mp3', '008-Al-Anfal 045-48.mp3'),
(148, 'qurantafseer/008-Al-Anfal 049-60.mp3', '008-Al-Anfal 049-60.mp3'),
(149, 'qurantafseer/008-Al-Anfal 061-66.mp3', '008-Al-Anfal 061-66.mp3'),
(150, 'qurantafseer/008-Al-Anfal 067-75.mp3', '008-Al-Anfal 067-75.mp3'),
(151, 'qurantafseer/009-At-Taubah 001-6.mp3', '009-At-Taubah 001-6.mp3'),
(152, 'qurantafseer/009-At-Taubah 007-16.mp3', '009-At-Taubah 007-16.mp3'),
(153, 'qurantafseer/009-At-Taubah 017-24.mp3', '009-At-Taubah 017-24.mp3'),
(154, 'qurantafseer/009-At-Taubah 025-28.mp3', '009-At-Taubah 025-28.mp3'),
(155, 'qurantafseer/009-At-Taubah 029-40.mp3', '009-At-Taubah 029-40.mp3'),
(156, 'qurantafseer/009-At-Taubah 041-57.mp3', '009-At-Taubah 041-57.mp3'),
(157, 'qurantafseer/009-At-Taubah 058-61.mp3', '009-At-Taubah 058-61.mp3'),
(158, 'qurantafseer/009-At-Taubah 062-72.mp3', '009-At-Taubah 062-72.mp3'),
(159, 'qurantafseer/009-At-Taubah 073-80.mp3', '009-At-Taubah 073-80.mp3'),
(160, 'qurantafseer/009-At-Taubah 081-89.mp3', '009-At-Taubah 081-89.mp3'),
(161, 'qurantafseer/009-At-Taubah 090-99.mp3', '009-At-Taubah 090-99.mp3'),
(162, 'qurantafseer/009-At-Taubah 100-106.mp3', '009-At-Taubah 100-106.mp3'),
(163, 'qurantafseer/009-At-Taubah 107-112.mp3', '009-At-Taubah 107-112.mp3'),
(164, 'qurantafseer/009-At-Taubah 113-121.mp3', '009-At-Taubah 113-121.mp3'),
(165, 'qurantafseer/009-At-Taubah 122-129.mp3', '009-At-Taubah 122-129.mp3'),
(166, 'qurantafseer/010-Yunus 001-7.mp3', '010-Yunus 001-7.mp3'),
(167, 'qurantafseer/010-Yunus 008-17.mp3', '010-Yunus 008-17.mp3'),
(168, 'qurantafseer/010-Yunus 018-25.mp3', '010-Yunus 018-25.mp3'),
(169, 'qurantafseer/010-Yunus 026-32.mp3', '010-Yunus 026-32.mp3'),
(170, 'qurantafseer/010-Yunus 033-53.mp3', '010-Yunus 033-53.mp3'),
(171, 'qurantafseer/010-Yunus 054-61.mp3', '010-Yunus 054-61.mp3'),
(172, 'qurantafseer/010-Yunus 062-70.mp3', '010-Yunus 062-70.mp3'),
(173, 'qurantafseer/010-Yunus 071-103.mp3', '010-Yunus 071-103.mp3'),
(174, 'qurantafseer/010-Yunus 104-109.mp3', '010-Yunus 104-109.mp3'),
(175, 'qurantafseer/011-Hud 001-8.mp3', '011-Hud 001-8.mp3'),
(176, 'qurantafseer/011-Hud 09-24.mp3', '011-Hud 09-24.mp3'),
(177, 'qurantafseer/011-Hud 025-35.mp3', '011-Hud 025-35.mp3'),
(178, 'qurantafseer/011-Hud 036-49.mp3', '011-Hud 036-49.mp3'),
(179, 'qurantafseer/011-Hud 050-60.mp3', '011-Hud 050-60.mp3'),
(180, 'qurantafseer/011-Hud 061-68.mp3', '011-Hud 061-68.mp3'),
(181, 'qurantafseer/011-Hud 069-83.mp3', '011-Hud 069-83.mp3'),
(182, 'qurantafseer/011-Hud 084-95.mp3', '011-Hud 084-95.mp3'),
(183, 'qurantafseer/011-Hud 096-109.mp3', '011-Hud 096-109.mp3'),
(184, 'qurantafseer/011-Hud 110-115.mp3', '011-Hud 110-115.mp3'),
(185, 'qurantafseer/011-Hud 115-123.mp3', '011-Hud 115-123.mp3'),
(186, 'qurantafseer/012-Yousuf 001-6.mp3', '012-Yousuf 001-6.mp3'),
(187, 'qurantafseer/012-Yousuf 007-20.mp3', '012-Yousuf 007-20.mp3'),
(188, 'qurantafseer/012-Yousuf 021-29.mp3', '012-Yousuf 021-29.mp3'),
(189, 'qurantafseer/012-Yousuf 030-42.mp3', '012-Yousuf 030-42.mp3'),
(190, 'qurantafseer/012-Yousuf 042-53.mp3', '012-Yousuf 042-53.mp3'),
(191, 'qurantafseer/012-Yousuf 053-57.mp3', '012-Yousuf 053-57.mp3'),
(192, 'qurantafseer/012-Yousuf 058-67.mp3', '012-Yousuf 058-67.mp3'),
(193, 'qurantafseer/012-Yousuf 068-79.mp3', '012-Yousuf 068-79.mp3'),
(194, 'qurantafseer/012-Yousuf 080-93.mp3', '012-Yousuf 080-93.mp3'),
(195, 'qurantafseer/012-Yousuf 093-101.mp3', '012-Yousuf 093-101.mp3'),
(196, 'qurantafseer/012-Yousuf 102-111.mp3', '012-Yousuf 102-111.mp3'),
(197, 'qurantafseer/013-Ar-Ra\'ad 01-6.mp3', '013-Ar-Ra\'ad 01-6.mp3'),
(198, 'qurantafseer/013-Ar-Ra\'ad 07-12.mp3', '013-Ar-Ra\'ad 07-12.mp3'),
(199, 'qurantafseer/013-Ar-Ra\'ad 13-18.mp3', '013-Ar-Ra\'ad 13-18.mp3'),
(200, 'qurantafseer/013-Ar-Ra\'ad 19-25.mp3', '013-Ar-Ra\'ad 19-25.mp3'),
(201, 'qurantafseer/013-Ar-Ra\'ad 26-29.mp3', '013-Ar-Ra\'ad 26-29.mp3'),
(202, 'qurantafseer/013-Ar-Ra\'ad 30-37.mp3', '013-Ar-Ra\'ad 30-37.mp3'),
(203, 'qurantafseer/013-Ar-Ra\'ad 38-43.mp3', '013-Ar-Ra\'ad 38-43.mp3'),
(204, 'qurantafseer/014-Ibrahim 01-4.mp3', '014-Ibrahim 01-4.mp3'),
(205, 'qurantafseer/014-Ibrahim 05-21.mp3', '014-Ibrahim 05-21.mp3'),
(206, 'qurantafseer/014-Ibrahim 22-27.mp3', '014-Ibrahim 22-27.mp3'),
(207, 'qurantafseer/014-Ibrahim 28-34.mp3', '014-Ibrahim 28-34.mp3'),
(208, 'qurantafseer/014-Ibrahim 35-41.mp3', '014-Ibrahim 35-41.mp3'),
(209, 'qurantafseer/014-Ibrahim 42-52.mp3', '014-Ibrahim 42-52.mp3'),
(210, 'qurantafseer/015-Al-Hijr 01-25.mp3', '015-Al-Hijr 01-25.mp3'),
(211, 'qurantafseer/015-Al-Hijr 26-44.mp3', '015-Al-Hijr 26-44.mp3'),
(212, 'qurantafseer/015-Al-Hijr 45-78.mp3', '015-Al-Hijr 45-78.mp3'),
(213, 'qurantafseer/015-Al-Hijr 79-99.mp3', '015-Al-Hijr 79-99.mp3'),
(214, 'qurantafseer/016-An-Nahal 001-9.mp3', '016-An-Nahal 001-9.mp3'),
(215, 'qurantafseer/016-An-Nahal 010-25.mp3', '016-An-Nahal 010-25.mp3'),
(216, 'qurantafseer/016-An-Nahal 026-40.mp3', '016-An-Nahal 026-40.mp3'),
(217, 'qurantafseer/016-An-Nahal 041-44.mp3', '016-An-Nahal 041-44.mp3'),
(218, 'qurantafseer/016-An-Nahal 045-60.mp3', '016-An-Nahal 045-60.mp3'),
(219, 'qurantafseer/016-An-Nahal 061-70.mp3', '016-An-Nahal 061-70.mp3'),
(220, 'qurantafseer/016-An-Nahal 071-83.mp3', '016-An-Nahal 071-83.mp3'),
(221, 'qurantafseer/016-An-Nahal 084-90.mp3', '016-An-Nahal 084-90.mp3'),
(222, 'qurantafseer/016-An-Nahal 098-110.mp3', '016-An-Nahal 098-110.mp3'),
(223, 'qurantafseer/016-An-Nahal 111-128.mp3', '016-An-Nahal 111-128.mp3'),
(224, 'qurantafseer/017-Bani-Israel 001-8.mp3', '017-Bani-Israel 001-8.mp3'),
(225, 'qurantafseer/017-Bani-Israel 009-15.mp3', '017-Bani-Israel 009-15.mp3'),
(226, 'qurantafseer/017-Bani-Israel 016-24.mp3', '017-Bani-Israel 016-24.mp3'),
(227, 'qurantafseer/017-Bani-Israel 025-30.mp3', '017-Bani-Israel 025-30.mp3'),
(228, 'qurantafseer/017-Bani-Israel 031-40.mp3', '017-Bani-Israel 031-40.mp3'),
(229, 'qurantafseer/017-Bani-Israel 041-52.mp3', '017-Bani-Israel 041-52.mp3'),
(230, 'qurantafseer/017-Bani-Israel 053-65.mp3', '017-Bani-Israel 053-65.mp3'),
(231, 'qurantafseer/017-Bani-Israel 066-77.mp3', '017-Bani-Israel 066-77.mp3'),
(232, 'qurantafseer/017-Bani-Israel 077-84.mp3', '017-Bani-Israel 077-84.mp3'),
(233, 'qurantafseer/017-Bani-Israel 085-100.mp3', '017-Bani-Israel 085-100.mp3'),
(234, 'qurantafseer/017-Bani-Israel 101-111.mp3', '017-Bani-Israel 101-111.mp3'),
(235, 'qurantafseer/018-Al-Kahaf 001-17.mp3', '018-Al-Kahaf 001-17.mp3'),
(236, 'qurantafseer/018-Al-Kahaf 018-26.mp3', '018-Al-Kahaf 018-26.mp3'),
(237, 'qurantafseer/018-Al-Kahaf 027-44.mp3', '018-Al-Kahaf 027-44.mp3'),
(238, 'qurantafseer/018-Al-Kahaf 045-53.mp3', '018-Al-Kahaf 045-53.mp3'),
(239, 'qurantafseer/018-Al-Kahaf 054-59.mp3', '018-Al-Kahaf 054-59.mp3'),
(240, 'qurantafseer/018-Al-Kahaf 060-82.mp3', '018-Al-Kahaf 060-82.mp3'),
(241, 'qurantafseer/018-Al-Kahaf 083-101.mp3', '018-Al-Kahaf 083-101.mp3'),
(242, 'qurantafseer/018-Al-Kahaf 102-110.mp3', '018-Al-Kahaf 102-110.mp3'),
(243, 'qurantafseer/019-Maryam 01-15.mp3', '019-Maryam 01-15.mp3'),
(244, 'qurantafseer/019-Maryam 16-40.mp3', '019-Maryam 16-40.mp3'),
(245, 'qurantafseer/019-Maryam 41-50.mp3', '019-Maryam 41-50.mp3'),
(246, 'qurantafseer/019-Maryam 51-65.mp3', '019-Maryam 51-65.mp3'),
(247, 'qurantafseer/019-Maryam 66-82.mp3', '019-Maryam 66-82.mp3'),
(248, 'qurantafseer/019-Maryam 83-98.mp3', '019-Maryam 83-98.mp3'),
(249, 'qurantafseer/020-Taha 001-24.mp3', '020-Taha 001-24.mp3'),
(250, 'qurantafseer/020-Taha 025-54.mp3', '020-Taha 025-54.mp3'),
(251, 'qurantafseer/020-Taha 055-76.mp3', '020-Taha 055-76.mp3'),
(252, 'qurantafseer/020-Taha 077-89.mp3', '020-Taha 077-89.mp3'),
(253, 'qurantafseer/020-Taha 090-104.mp3', '020-Taha 090-104.mp3'),
(254, 'qurantafseer/020-Taha 105-115.mp3', '020-Taha 105-115.mp3'),
(255, 'qurantafseer/020-Taha 116-128.mp3', '020-Taha 116-128.mp3'),
(256, 'qurantafseer/020-Taha 129-135.mp3', '020-Taha 129-135.mp3'),
(257, 'qurantafseer/021-Al-Anbiya 01-10.mp3', '021-Al-Anbiya 01-10.mp3'),
(258, 'qurantafseer/021-Al-Anbiya 11-29.mp3', '021-Al-Anbiya 11-29.mp3'),
(259, 'qurantafseer/021-Al-Anbiya 30-41.mp3', '021-Al-Anbiya 30-41.mp3'),
(260, 'qurantafseer/021-Al-Anbiya 42-50.mp3', '021-Al-Anbiya 42-50.mp3'),
(261, 'qurantafseer/021-Al-Anbiya 51-75.mp3', '021-Al-Anbiya 51-75.mp3'),
(262, 'qurantafseer/021-Al-Anbiya 76-93.mp3', '021-Al-Anbiya 76-93.mp3'),
(263, 'qurantafseer/021-Al-Anbiya 94-112.mp3', '021-Al-Anbiya 94-112.mp3'),
(264, 'qurantafseer/022-Al-Hajj 01-10.mp3', '022-Al-Hajj 01-10.mp3'),
(265, 'qurantafseer/022-Al-Hajj 11-25.mp3', '022-Al-Hajj 11-25.mp3'),
(266, 'qurantafseer/022-Al-Hajj 26-33.mp3', '022-Al-Hajj 26-33.mp3'),
(267, 'qurantafseer/022-Al-Hajj 34-38.mp3', '022-Al-Hajj 34-38.mp3'),
(268, 'qurantafseer/022-Al-Hajj 39-51.mp3', '022-Al-Hajj 39-51.mp3'),
(269, 'qurantafseer/022-Al-Hajj 52-57.mp3', '022-Al-Hajj 52-57.mp3'),
(270, 'qurantafseer/022-Al-Hajj 58-69.mp3', '022-Al-Hajj 58-69.mp3'),
(271, 'qurantafseer/022-Al-Hajj 70-78.mp3', '022-Al-Hajj 70-78.mp3'),
(272, 'qurantafseer/023-Al-Muminun 01-22.mp3', '023-Al-Muminun 01-22.mp3'),
(273, 'qurantafseer/023-Al-Muminun 23-50.mp3', '023-Al-Muminun 23-50.mp3'),
(274, 'qurantafseer/023-Al-Muminun 51-77.mp3', '023-Al-Muminun 51-77.mp3'),
(275, 'qurantafseer/023-Al-Muminun 78-118.mp3', '023-Al-Muminun 78-118.mp3'),
(276, 'qurantafseer/024-An-Nur 01-10.mp3', '024-An-Nur 01-10.mp3'),
(277, 'qurantafseer/024-An-Nur 11-20.mp3', '024-An-Nur 11-20.mp3'),
(278, 'qurantafseer/024-An-Nur 21-26.mp3', '024-An-Nur 21-26.mp3'),
(279, 'qurantafseer/024-An-Nur 27-30.mp3', '024-An-Nur 27-30.mp3'),
(280, 'qurantafseer/024-An-Nur 31-34.mp3', '024-An-Nur 31-34.mp3'),
(281, 'qurantafseer/024-An-Nur 35-40.mp3', '024-An-Nur 35-40.mp3'),
(282, 'qurantafseer/024-An-Nur 41-54.mp3', '024-An-Nur 41-54.mp3'),
(283, 'qurantafseer/024-An-Nur 55-60.mp3', '024-An-Nur 55-60.mp3'),
(284, 'qurantafseer/024-An-Nur 61-64.mp3', '024-An-Nur 61-64.mp3'),
(285, 'qurantafseer/025-Al-Furqan 01-9.mp3', '025-Al-Furqan 01-9.mp3'),
(286, 'qurantafseer/025-Al-Furqan 10-20.mp3', '025-Al-Furqan 10-20.mp3'),
(287, 'qurantafseer/025-Al-Furqan 21-34.mp3', '025-Al-Furqan 21-34.mp3'),
(288, 'qurantafseer/025-Al-Furqan 35-44.mp3', '025-Al-Furqan 35-44.mp3'),
(289, 'qurantafseer/025-Al-Furqan 45-60.mp3', '025-Al-Furqan 45-60.mp3'),
(290, 'qurantafseer/025-Al-Furqan 61-77.mp3', '025-Al-Furqan 61-77.mp3'),
(291, 'qurantafseer/026-Ash-Shuara 001-33.mp3', '026-Ash-Shuara 001-33.mp3'),
(292, 'qurantafseer/026-Ash-Shuara 034-68.mp3', '026-Ash-Shuara 034-68.mp3'),
(293, 'qurantafseer/026-Ash-Shuara 069-104.mp3', '026-Ash-Shuara 069-104.mp3'),
(294, 'qurantafseer/026-Ash-Shuara 105-140.mp3', '026-Ash-Shuara 105-140.mp3'),
(295, 'qurantafseer/026-Ash-Shuara 141-175.mp3', '026-Ash-Shuara 141-175.mp3'),
(296, 'qurantafseer/026-Ash-Shuara 176-191.mp3', '026-Ash-Shuara 176-191.mp3'),
(297, 'qurantafseer/026-Ash-Shuara 192-227.mp3', '026-Ash-Shuara 192-227.mp3'),
(298, 'qurantafseer/027-An-Namal 01-14.mp3', '027-An-Namal 01-14.mp3'),
(299, 'qurantafseer/027-An-Namal 15-31.mp3', '027-An-Namal 15-31.mp3'),
(300, 'qurantafseer/027-An-Namal 32-44.mp3', '027-An-Namal 32-44.mp3'),
(301, 'qurantafseer/027-An-Namal 45-59.mp3', '027-An-Namal 45-59.mp3'),
(302, 'qurantafseer/027-An-Namal 60-66.mp3', '027-An-Namal 60-66.mp3'),
(303, 'qurantafseer/027-An-Namal 67-82.mp3', '027-An-Namal 67-82.mp3'),
(304, 'qurantafseer/027-An-Namal 83-93.mp3', '027-An-Namal 83-93.mp3'),
(305, 'qurantafseer/028-Al-Qasas 01- 13.mp3', '028-Al-Qasas 01- 13.mp3'),
(306, 'qurantafseer/028-Al-Qasas 14- 28.mp3', '028-Al-Qasas 14- 28.mp3'),
(307, 'qurantafseer/028-Al-Qasas 29- 42.mp3', '028-Al-Qasas 29- 42.mp3'),
(308, 'qurantafseer/028-Al-Qasas 43- 50.mp3', '028-Al-Qasas 43- 50.mp3'),
(309, 'qurantafseer/028-Al-Qasas 51- 60.mp3', '028-Al-Qasas 51- 60.mp3'),
(310, 'qurantafseer/028-Al-Qasas 61- 75.mp3', '028-Al-Qasas 61- 75.mp3'),
(311, 'qurantafseer/028-Al-Qasas 76- 88.mp3', '028-Al-Qasas 76- 88.mp3'),
(312, 'qurantafseer/029-Al-Ankabut 01-13.mp3', '029-Al-Ankabut 01-13.mp3'),
(313, 'qurantafseer/029-Al-Ankabut 14-22.mp3', '029-Al-Ankabut 14-22.mp3'),
(314, 'qurantafseer/029-Al-Ankabut 23-44.mp3', '029-Al-Ankabut 23-44.mp3'),
(315, 'qurantafseer/029-Al-Ankabut 45-51.mp3', '029-Al-Ankabut 45-51.mp3'),
(316, 'qurantafseer/029-Al-Ankabut 52-63.mp3', '029-Al-Ankabut 52-63.mp3'),
(317, 'qurantafseer/029-Al-Ankabut 64-69.mp3', '029-Al-Ankabut 64-69.mp3'),
(318, 'qurantafseer/030-Ar-Rum 01-10.mp3', '030-Ar-Rum 01-10.mp3'),
(319, 'qurantafseer/030-Ar-Rum 11-19.mp3', '030-Ar-Rum 11-19.mp3'),
(320, 'qurantafseer/030-Ar-Rum 20-27.mp3', '030-Ar-Rum 20-27.mp3'),
(321, 'qurantafseer/030-Ar-Rum 28-40.mp3', '030-Ar-Rum 28-40.mp3'),
(322, 'qurantafseer/030-Ar-Rum 41-53.mp3', '030-Ar-Rum 41-53.mp3'),
(323, 'qurantafseer/030-Ar-Rum 54-60.mp3', '030-Ar-Rum 54-60.mp3'),
(324, 'qurantafseer/031-Luqman 01-11.mp3', '031-Luqman 01-11.mp3'),
(325, 'qurantafseer/031-Luqman 12-19.mp3', '031-Luqman 12-19.mp3'),
(326, 'qurantafseer/031-Luqman 20-30.mp3', '031-Luqman 20-30.mp3'),
(327, 'qurantafseer/031-Luqman 31-34.mp3', '031-Luqman 31-34.mp3'),
(328, 'qurantafseer/032-As-Sajda 01-11.mp3', '032-As-Sajda 01-11.mp3'),
(329, 'qurantafseer/032-As-Sajda 12-30.mp3', '032-As-Sajda 12-30.mp3'),
(330, 'qurantafseer/033-Al-Ahzab 01-8.mp3', '033-Al-Ahzab 01-8.mp3'),
(331, 'qurantafseer/033-Al-Ahzab 09-20.mp3', '033-Al-Ahzab 09-20.mp3'),
(332, 'qurantafseer/033-Al-Ahzab 21-27.mp3', '033-Al-Ahzab 21-27.mp3'),
(333, 'qurantafseer/033-Al-Ahzab 28-34.mp3', '033-Al-Ahzab 28-34.mp3'),
(334, 'qurantafseer/033-Al-Ahzab 35-40.mp3', '033-Al-Ahzab 35-40.mp3'),
(335, 'qurantafseer/033-Al-Ahzab 40-48.mp3', '033-Al-Ahzab 40-48.mp3'),
(336, 'qurantafseer/033-Al-Ahzab 49-52.mp3', '033-Al-Ahzab 49-52.mp3'),
(337, 'qurantafseer/033-Al-Ahzab 53-58.mp3', '033-Al-Ahzab 53-58.mp3'),
(338, 'qurantafseer/033-Al-Ahzab 59-73.mp3', '033-Al-Ahzab 59-73.mp3'),
(339, 'qurantafseer/034-Saba 01-9.mp3', '034-Saba 01-9.mp3'),
(340, 'qurantafseer/034-Saba 10-14.mp3', '034-Saba 10-14.mp3'),
(341, 'qurantafseer/034-Saba 15-21.mp3', '034-Saba 15-21.mp3'),
(342, 'qurantafseer/034-Saba 22-37.mp3', '034-Saba 22-37.mp3'),
(343, 'qurantafseer/034-Saba 38-54.mp3', '034-Saba 38-54.mp3'),
(344, 'qurantafseer/035-Faatir 01-7.mp3', '035-Faatir 01-7.mp3'),
(345, 'qurantafseer/035-Faatir 8-14.mp3', '035-Faatir 8-14.mp3'),
(346, 'qurantafseer/035-Faatir 15-26.mp3', '035-Faatir 15-26.mp3'),
(347, 'qurantafseer/035-Faatir 27-37.mp3', '035-Faatir 27-37.mp3'),
(348, 'qurantafseer/035-Faatir 38-45.mp3', '035-Faatir 38-45.mp3'),
(349, 'qurantafseer/036-Yaasiin 01-12.mp3', '036-Yaasiin 01-12.mp3'),
(350, 'qurantafseer/036-Yaasiin 13-32.mp3', '036-Yaasiin 13-32.mp3'),
(351, 'qurantafseer/036-Yaasiin 33-50.mp3', '036-Yaasiin 33-50.mp3'),
(352, 'qurantafseer/036-Yaasiin 51-83.mp3', '036-Yaasiin 51-83.mp3'),
(353, 'qurantafseer/037-As-Saffaat 01-21.mp3', '037-As-Saffaat 01-21.mp3'),
(354, 'qurantafseer/037-As-Saffaat 22-61.mp3', '037-As-Saffaat 22-61.mp3'),
(355, 'qurantafseer/037-As-Saffaat 62-82.mp3', '037-As-Saffaat 62-82.mp3'),
(356, 'qurantafseer/037-As-Saffaat 83-113.mp3', '037-As-Saffaat 83-113.mp3'),
(357, 'qurantafseer/037-As-Saffaat 114-138.mp3', '037-As-Saffaat 114-138.mp3'),
(358, 'qurantafseer/037-As-Saffaat 139-182.mp3', '037-As-Saffaat 139-182.mp3'),
(359, 'qurantafseer/038-Saad 01-26.mp3', '038-Saad 01-26.mp3'),
(360, 'qurantafseer/038-Saad 27-40.mp3', '038-Saad 27-40.mp3'),
(361, 'qurantafseer/038-Saad 41-64.mp3', '038-Saad 41-64.mp3'),
(362, 'qurantafseer/038-Saad 65-88.mp3', '038-Saad 65-88.mp3'),
(363, 'qurantafseer/039-Az-Zumar 01-9.mp3', '039-Az-Zumar 01-9.mp3'),
(364, 'qurantafseer/039-Az-Zumar 10-21.mp3', '039-Az-Zumar 10-21.mp3'),
(365, 'qurantafseer/039-Az-Zumar 22-31.mp3', '039-Az-Zumar 22-31.mp3'),
(366, 'qurantafseer/039-Az-Zumar 32-41.mp3', '039-Az-Zumar 32-41.mp3'),
(367, 'qurantafseer/039-Az-Zumar 42-52.mp3', '039-Az-Zumar 42-52.mp3'),
(368, 'qurantafseer/039-Az-Zumar 53-67.mp3', '039-Az-Zumar 53-67.mp3'),
(369, 'qurantafseer/039-Az-Zumar 68-75.mp3', '039-Az-Zumar 68-75.mp3'),
(370, 'qurantafseer/040-Al-Momin 01-9.mp3', '040-Al-Momin 01-9.mp3'),
(371, 'qurantafseer/040-Al-Momin 10-22.mp3', '040-Al-Momin 10-22.mp3'),
(372, 'qurantafseer/040-Al-Momin 23-46.mp3', '040-Al-Momin 23-46.mp3'),
(373, 'qurantafseer/040-Al-Momin 47-60.mp3', '040-Al-Momin 47-60.mp3'),
(374, 'qurantafseer/040-Al-Momin 61-68.mp3', '040-Al-Momin 61-68.mp3'),
(375, 'qurantafseer/040-Al-Momin 69-85.mp3', '040-Al-Momin 69-85.mp3'),
(376, 'qurantafseer/041-Hamim As-Sajda 01-12.mp3', '041-Hamim As-Sajda 01-12.mp3'),
(377, 'qurantafseer/041-Hamim As-Sajda 13-25.mp3', '041-Hamim As-Sajda 13-25.mp3'),
(378, 'qurantafseer/041-Hamim As-Sajda 26-36.mp3', '041-Hamim As-Sajda 26-36.mp3'),
(379, 'qurantafseer/041-Hamim As-Sajda 36-46.mp3', '041-Hamim As-Sajda 36-46.mp3'),
(380, 'qurantafseer/041-Hamim As-Sajda 47-54.mp3', '041-Hamim As-Sajda 47-54.mp3'),
(381, 'qurantafseer/042-Ash-Shoora 01-9.mp3', '042-Ash-Shoora 01-9.mp3'),
(382, 'qurantafseer/042-Ash-Shoora 10-19.mp3', '042-Ash-Shoora 10-19.mp3'),
(383, 'qurantafseer/042-Ash-Shoora 20-29.mp3', '042-Ash-Shoora 20-29.mp3'),
(384, 'qurantafseer/042-Ash-Shoora 30-43.mp3', '042-Ash-Shoora 30-43.mp3'),
(385, 'qurantafseer/042-Ash-Shoora 44-53.mp3', '042-Ash-Shoora 44-53.mp3'),
(386, 'qurantafseer/043-Az-Zukruf 01-15.mp3', '043-Az-Zukruf 01-15.mp3'),
(387, 'qurantafseer/043-Az-Zukruf 16-35.mp3', '043-Az-Zukruf 16-35.mp3'),
(388, 'qurantafseer/043-Az-Zukruf 36-56.mp3', '043-Az-Zukruf 36-56.mp3'),
(389, 'qurantafseer/043-Az-Zukruf 57-67.mp3', '043-Az-Zukruf 57-67.mp3'),
(390, 'qurantafseer/043-Az-Zukruf 68-89.mp3', '043-Az-Zukruf 68-89.mp3'),
(391, 'qurantafseer/044-Ad-Dukhan 01-29.mp3', '044-Ad-Dukhan 01-29.mp3'),
(392, 'qurantafseer/044-Ad-Dukhan 30-59.mp3', '044-Ad-Dukhan 30-59.mp3'),
(393, 'qurantafseer/045-Al-Jasiya 01-11.mp3', '045-Al-Jasiya 01-11.mp3'),
(394, 'qurantafseer/045-Al-Jasiya 12-21.mp3', '045-Al-Jasiya 12-21.mp3'),
(395, 'qurantafseer/045-Al-Jathiya 22-37.mp3', '045-Al-Jathiya 22-37.mp3'),
(396, 'qurantafseer/046-Al-Ahqaf 01-10.mp3', '046-Al-Ahqaf 01-10.mp3'),
(397, 'qurantafseer/046-Al-Ahqaf 11-20.mp3', '046-Al-Ahqaf 11-20.mp3'),
(398, 'qurantafseer/046-Al-Ahqaf 21-35.mp3', '046-Al-Ahqaf 21-35.mp3'),
(399, 'qurantafseer/047-Muhammad 01-11.mp3', '047-Muhammad 01-11.mp3'),
(400, 'qurantafseer/047-Muhammad 12-19.mp3', '047-Muhammad 12-19.mp3'),
(401, 'qurantafseer/047-Muhammad 20-28.mp3', '047-Muhammad 20-28.mp3'),
(402, 'qurantafseer/047-Muhammad 29-38.mp3', '047-Muhammad 29-38.mp3'),
(403, 'qurantafseer/048-Al-Fath 01-7.mp3', '048-Al-Fath 01-7.mp3'),
(404, 'qurantafseer/048-Al-Fath 08-14.mp3', '048-Al-Fath 08-14.mp3'),
(405, 'qurantafseer/048-Al-Fath 15-17.mp3', '048-Al-Fath 15-17.mp3'),
(406, 'qurantafseer/048-Al-Fath 18-24.mp3', '048-Al-Fath 18-24.mp3'),
(407, 'qurantafseer/048-Al-Fath 25-27.mp3', '048-Al-Fath 25-27.mp3'),
(408, 'qurantafseer/048-Al-Fath 28-29.mp3', '048-Al-Fath 28-29.mp3'),
(409, 'qurantafseer/049-Al-Hujraat 01-6.mp3', '049-Al-Hujraat 01-6.mp3'),
(410, 'qurantafseer/049-Al-Hujraat 07-13.mp3', '049-Al-Hujraat 07-13.mp3'),
(411, 'qurantafseer/049-Al-Hujraat 14-18.mp3', '049-Al-Hujraat 14-18.mp3'),
(412, 'qurantafseer/050-Qaaf 01-15.mp3', '050-Qaaf 01-15.mp3'),
(413, 'qurantafseer/050-Qaaf 16-29.mp3', '050-Qaaf 16-29.mp3'),
(414, 'qurantafseer/050-Qaaf 30-45.mp3', '050-Qaaf 30-45.mp3'),
(415, 'qurantafseer/051-Az-Zariayat 01-52.mp3', '051-Az-Zariayat 01-52.mp3'),
(416, 'qurantafseer/051-Az-Zariayat 53-60.mp3', '051-Az-Zariayat 53-60.mp3'),
(417, 'qurantafseer/052-At-Tur 1-49.mp3', '052-At-Tur 1-49.mp3'),
(418, 'qurantafseer/053-An-Najm 01-16.mp3', '053-An-Najm 01-16.mp3'),
(419, 'qurantafseer/053-An-Najm 17-30.mp3', '053-An-Najm 17-30.mp3'),
(420, 'qurantafseer/053-An-Najm 31-62.mp3', '053-An-Najm 31-62.mp3'),
(421, 'qurantafseer/054-Al-Qamar 01-8.mp3', '054-Al-Qamar 01-8.mp3'),
(422, 'qurantafseer/054-Al-Qamar 09-40.mp3', '054-Al-Qamar 09-40.mp3'),
(423, 'qurantafseer/054-Al-Qamar 41-55.mp3', '054-Al-Qamar 41-55.mp3'),
(424, 'qurantafseer/055-Ar-Rahman 01-25.mp3', '055-Ar-Rahman 01-25.mp3'),
(425, 'qurantafseer/055-Ar-Rahman 26-78.mp3', '055-Ar-Rahman 26-78.mp3'),
(426, 'qurantafseer/056-Al-Waqiyah 01-96.mp3', '056-Al-Waqiyah 01-96.mp3'),
(427, 'qurantafseer/057-Al-Hadeed 01-6.mp3', '057-Al-Hadeed 01-6.mp3'),
(428, 'qurantafseer/057-Al-Hadeed 07-10.mp3', '057-Al-Hadeed 07-10.mp3'),
(429, 'qurantafseer/057-Al-Hadeed 11-19.mp3', '057-Al-Hadeed 11-19.mp3'),
(430, 'qurantafseer/057-Al-Hadeed 16-25.mp3', '057-Al-Hadeed 16-25.mp3'),
(431, 'qurantafseer/057-Al-Hadeed 26-29.mp3', '057-Al-Hadeed 26-29.mp3'),
(432, 'qurantafseer/058-Al-Mujadila 1-22.mp3', '058-Al-Mujadila 1-22.mp3'),
(433, 'qurantafseer/059-Al-Hashar 01-10.mp3', '059-Al-Hashar 01-10.mp3'),
(434, 'qurantafseer/059-Al-Hashar 10-17.mp3', '059-Al-Hashar 10-17.mp3'),
(435, 'qurantafseer/059-Al-Hashar 18-24.mp3', '059-Al-Hashar 18-24.mp3'),
(436, 'qurantafseer/060-Al-Mumtahina 1-13.mp3', '060-Al-Mumtahina 1-13.mp3'),
(437, 'qurantafseer/061-As-Saff 01-9.mp3', '061-As-Saff 01-9.mp3'),
(438, 'qurantafseer/061-As-Saff 10-14.mp3', '061-As-Saff 10-14.mp3'),
(439, 'qurantafseer/062-Al-Juma\' 1-8.mp3', '062-Al-Juma\' 1-8.mp3'),
(440, 'qurantafseer/062-Al-Juma\' 9-11.mp3', '062-Al-Juma\' 9-11.mp3'),
(441, 'qurantafseer/063-Al-Munafiqun 1-11.mp3', '063-Al-Munafiqun 1-11.mp3'),
(442, 'qurantafseer/064-At-Taghabun 1-8.mp3', '064-At-Taghabun 1-8.mp3'),
(443, 'qurantafseer/064-At-Taghabun 9-18.mp3', '064-At-Taghabun 9-18.mp3'),
(444, 'qurantafseer/065-At-Talaq 1-7.mp3', '065-At-Talaq 1-7.mp3'),
(445, 'qurantafseer/065-At-Talaq 8-12.mp3', '065-At-Talaq 8-12.mp3'),
(446, 'qurantafseer/066-At-Tahrim 1-8.mp3', '066-At-Tahrim 1-8.mp3'),
(447, 'qurantafseer/066-At-Tahrim 9-12.mp3', '066-At-Tahrim 9-12.mp3'),
(448, 'qurantafseer/067-Al-Mulk 1-30.mp3', '067-Al-Mulk 1-30.mp3'),
(449, 'qurantafseer/068.Al-Qalam 1-52.mp3', '068.Al-Qalam 1-52.mp3'),
(450, 'qurantafseer/069.Al-Haaqqa 1-52.mp3', '069.Al-Haaqqa 1-52.mp3'),
(451, 'qurantafseer/070.Al-Ma\'arij 1-44.mp3', '070.Al-Ma\'arij 1-44.mp3'),
(452, 'qurantafseer/071.Nuh 1-28.mp3', '071.Nuh 1-28.mp3'),
(453, 'qurantafseer/072.Al-Jinn 1-28.mp3', '072.Al-Jinn 1-28.mp3'),
(454, 'qurantafseer/073.Al-Muzammil 1-5.mp3', '073.Al-Muzammil 1-5.mp3'),
(455, 'qurantafseer/073.Al-Muzammil 6-20.mp3', '073.Al-Muzammil 6-20.mp3'),
(456, 'qurantafseer/074.Al-Mudassir 1-31.mp3', '074.Al-Mudassir 1-31.mp3'),
(457, 'qurantafseer/074.Al-Mudassir 32-56.mp3', '074.Al-Mudassir 32-56.mp3'),
(458, 'qurantafseer/075.Al-Qayammah 1-40.mp3', '075.Al-Qayammah 1-40.mp3'),
(459, 'qurantafseer/076.Ad-Dahar 1-31.mp3', '076.Ad-Dahar 1-31.mp3'),
(460, 'qurantafseer/077.Al-Mursalaat 1- 50.mp3', '077.Al-Mursalaat 1- 50.mp3'),
(461, 'qurantafseer/078.An Nabaa 1-40.mp3', '078.An Nabaa 1-40.mp3'),
(462, 'qurantafseer/079.Al Naziyat 1-46.mp3', '079.Al Naziyat 1-46.mp3'),
(463, 'qurantafseer/080.Abasa 1-42.mp3', '080.Abasa 1-42.mp3'),
(464, 'qurantafseer/081.Al Takwir 1-29.mp3', '081.Al Takwir 1-29.mp3'),
(465, 'qurantafseer/082.Al Infitar 1-19.mp3', '082.Al Infitar 1-19.mp3'),
(466, 'qurantafseer/083.Al Mutaffifin 1-36 .mp3', '083.Al Mutaffifin 1-36 .mp3'),
(467, 'qurantafseer/084.Al - Insheqaq 1-25.mp3', '084.Al - Insheqaq 1-25.mp3'),
(468, 'qurantafseer/085.Al Buruj 1-22.mp3', '085.Al Buruj 1-22.mp3'),
(469, 'qurantafseer/086.Al Tariq 1-17.mp3', '086.Al Tariq 1-17.mp3'),
(470, 'qurantafseer/087.Al Aala 1-19.mp3', '087.Al Aala 1-19.mp3'),
(471, 'qurantafseer/088.Al Ghashiya 1-26.mp3', '088.Al Ghashiya 1-26.mp3'),
(472, 'qurantafseer/089.Al Fajr 1-30.mp3', '089.Al Fajr 1-30.mp3'),
(473, 'qurantafseer/090.Al Balad 1-20.mp3', '090.Al Balad 1-20.mp3'),
(474, 'qurantafseer/091.AL Shams 1-15.mp3', '091.AL Shams 1-15.mp3'),
(475, 'qurantafseer/092.Al Lail 1-21 .mp3', '092.Al Lail 1-21 .mp3'),
(476, 'qurantafseer/093.Az Zuha 1-11.mp3', '093.Az Zuha 1-11.mp3'),
(477, 'qurantafseer/094.Alam Nashrah 1-8.mp3', '094.Alam Nashrah 1-8.mp3'),
(478, 'qurantafseer/095.At Teen 1-8.mp3', '095.At Teen 1-8.mp3'),
(479, 'qurantafseer/096.Al Alaq 1-19.mp3', '096.Al Alaq 1-19.mp3'),
(480, 'qurantafseer/097.Al  Qadar 1-5.mp3', '097.Al  Qadar 1-5.mp3'),
(481, 'qurantafseer/098.Al Bayyina 1-8.mp3', '098.Al Bayyina 1-8.mp3'),
(482, 'qurantafseer/099.Al Zilzal 1-8.mp3', '099.Al Zilzal 1-8.mp3'),
(483, 'qurantafseer/100.Al  Adiyat 1-11.mp3', '100.Al  Adiyat 1-11.mp3'),
(484, 'qurantafseer/101.Al Qariyah 1-11.mp3', '101.Al Qariyah 1-11.mp3'),
(485, 'qurantafseer/102.At Takasur 1-8.mp3', '102.At Takasur 1-8.mp3'),
(486, 'qurantafseer/103.Al Asar 1-3 .mp3', '103.Al Asar 1-3 .mp3'),
(487, 'qurantafseer/104.Al Humaza 1-9.mp3', '104.Al Humaza 1-9.mp3'),
(488, 'qurantafseer/105.Al  Feel 1-5   106.Quraish 1-4.mp3', '105.Al  Feel 1-5   106.Quraish 1-4.mp3'),
(489, 'qurantafseer/107.Al Maun 1-7.mp3', '107.Al Maun 1-7.mp3'),
(490, 'qurantafseer/108.Al Kauser 1-3.mp3', '108.Al Kauser 1-3.mp3'),
(491, 'qurantafseer/109.Al Kaferun 1-6.mp3', '109.Al Kaferun 1-6.mp3'),
(492, 'qurantafseer/110.An Nasar 1-3.mp3', '110.An Nasar 1-3.mp3'),
(493, 'qurantafseer/111.Al Lahab 1-5.mp3', '111.Al Lahab 1-5.mp3'),
(494, 'qurantafseer/Moulana_Mohammed_AmirKhan_Quasimi.png', 'Moulana_Mohammed_AmirKhan_Quasimi.png'),
(495, 'qurantafseer/112.Al Iklhas 1-4.mp3', '112.Al Iklhas 1-4.mp3'),
(496, 'qurantafseer/113.Al Falaq 1-5   114.An - Nas 1-6.mp3', '113.Al Falaq 1-5   114.An - Nas 1-6.mp3');

-- --------------------------------------------------------

--
-- Table structure for table `audio_files`
--

CREATE TABLE `audio_files` (
  `id` bigint(20) NOT NULL,
  `surah_id` int(11) NOT NULL,
  `ayah_id` bigint(20) NOT NULL,
  `reciter_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ayahs`
--

CREATE TABLE `ayahs` (
  `id` bigint(20) NOT NULL,
  `surah_id` int(11) NOT NULL,
  `ayah_number` int(11) NOT NULL,
  `arabic_text` text NOT NULL,
  `english_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `downloads`
--

CREATE TABLE `downloads` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `audio_file_id` bigint(20) NOT NULL,
  `downloaded_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`name`, `email`, `mobile`, `query`) VALUES
('SHAIK KHAJA MYNUDDIN', 'smartworldcom@gmail.com', '0812199071', 'Assalamualaikum'),
('SHAIK KHAJA MYNUDDIN', 'smartworldcom@gmail.com', '0812199071', 'Assalamualaikum'),
('SHAIK KHAJA MYNUDDIN', 'smartworldcom@gmail.com', '0812199071', 'Assalamualaikum');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` int(11) NOT NULL,
  `gateway` enum('razorpay') NOT NULL,
  `gateway_payment_id` varchar(255) DEFAULT NULL,
  `gateway_order_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `status` enum('created','paid','failed','refunded') DEFAULT 'created',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_items`
--

CREATE TABLE `playlist_items` (
  `id` bigint(20) NOT NULL,
  `playlist_id` bigint(20) NOT NULL,
  `ayah_id` bigint(20) NOT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quran_audio`
--

CREATE TABLE `quran_audio` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(500) NOT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `surah_no` int(11) NOT NULL,
  `ayah_start` int(11) DEFAULT NULL,
  `ayah_end` int(11) DEFAULT NULL,
  `reciter` varchar(100) DEFAULT NULL,
  `language` varchar(50) DEFAULT 'ar',
  `bitrate` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quran_audio`
--

INSERT INTO `quran_audio` (`id`, `filename`, `filepath`, `file_size`, `duration_seconds`, `surah_no`, `ayah_start`, `ayah_end`, `reciter`, `language`, `bitrate`, `is_active`, `created_at`, `updated_at`) VALUES
(512, '001-Al-Fatihah.mp3', 'qurantafseer/001-Al-Fatihah.mp3', NULL, NULL, 1, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(513, '002-Al-Baqara 001-5.mp3', 'qurantafseer/002-Al-Baqara 001-5.mp3', NULL, NULL, 2, 1, 5, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(514, '002-Al-Baqara 006-20.mp3', 'qurantafseer/002-Al-Baqara 006-20.mp3', NULL, NULL, 2, 6, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(515, '002-Al-Baqara 021-24.mp3', 'qurantafseer/002-Al-Baqara 021-24.mp3', NULL, NULL, 2, 21, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(516, '002-Al-Baqara 025-29.mp3', 'qurantafseer/002-Al-Baqara 025-29.mp3', NULL, NULL, 2, 25, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(517, '002-Al-Baqara 030-39.mp3', 'qurantafseer/002-Al-Baqara 030-39.mp3', NULL, NULL, 2, 30, 39, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(518, '002-Al-Baqara 040-46.mp3', 'qurantafseer/002-Al-Baqara 040-46.mp3', NULL, NULL, 2, 40, 46, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(519, '002-Al-Baqara 047-59.mp3', 'qurantafseer/002-Al-Baqara 047-59.mp3', NULL, NULL, 2, 47, 59, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(520, '002-Al-Baqara 060-61.mp3', 'qurantafseer/002-Al-Baqara 060-61.mp3', NULL, NULL, 2, 60, 61, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(521, '002-Al-Baqara 062-82.mp3', 'qurantafseer/002-Al-Baqara 062-82.mp3', NULL, NULL, 2, 62, 82, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(522, '002-Al-Baqara 083-91.mp3', 'qurantafseer/002-Al-Baqara 083-91.mp3', NULL, NULL, 2, 83, 91, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(523, '002-Al-Baqara 092-108.mp3', 'qurantafseer/002-Al-Baqara 092-108.mp3', NULL, NULL, 2, 92, 108, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(524, '002-Al-Baqara 109-117.mp3', 'qurantafseer/002-Al-Baqara 109-117.mp3', NULL, NULL, 2, 109, 117, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(525, '002-Al-Baqara 118-120.mp3', 'qurantafseer/002-Al-Baqara 118-120.mp3', NULL, NULL, 2, 118, 120, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(526, '002-Al-Baqara 121-128.mp3', 'qurantafseer/002-Al-Baqara 121-128.mp3', NULL, NULL, 2, 121, 128, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(527, '002-Al-Baqara 129-135.mp3', 'qurantafseer/002-Al-Baqara 129-135.mp3', NULL, NULL, 2, 129, 135, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(528, '002-Al-Baqara 136-141.mp3', 'qurantafseer/002-Al-Baqara 136-141.mp3', NULL, NULL, 2, 136, 141, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(529, '002-Al-Baqara 142-143.mp3', 'qurantafseer/002-Al-Baqara 142-143.mp3', NULL, NULL, 2, 142, 143, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(530, '002-Al-Baqara 144-152.mp3', 'qurantafseer/002-Al-Baqara 144-152.mp3', NULL, NULL, 2, 144, 152, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(531, '002-Al-Baqara 153-158.mp3', 'qurantafseer/002-Al-Baqara 153-158.mp3', NULL, NULL, 2, 153, 158, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(532, '002-Al-Baqara 159-167.mp3', 'qurantafseer/002-Al-Baqara 159-167.mp3', NULL, NULL, 2, 159, 167, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(533, '002-Al-Baqara 168-176.mp3', 'qurantafseer/002-Al-Baqara 168-176.mp3', NULL, NULL, 2, 168, 176, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(534, '002-Al-Baqara 177-182.mp3', 'qurantafseer/002-Al-Baqara 177-182.mp3', NULL, NULL, 2, 177, 182, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(535, '002-Al-Baqara 183-187.mp3', 'qurantafseer/002-Al-Baqara 183-187.mp3', NULL, NULL, 2, 183, 187, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(536, '002-Al-Baqara 187-188.mp3', 'qurantafseer/002-Al-Baqara 187-188.mp3', NULL, NULL, 2, 187, 188, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(537, '002-Al-Baqara 189-196.mp3', 'qurantafseer/002-Al-Baqara 189-196.mp3', NULL, NULL, 2, 189, 196, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(538, '002-Al-Baqara 197-210.mp3', 'qurantafseer/002-Al-Baqara 197-210.mp3', NULL, NULL, 2, 197, 210, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(539, '002-Al-Baqara 211-215.mp3', 'qurantafseer/002-Al-Baqara 211-215.mp3', NULL, NULL, 2, 211, 215, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(540, '002-Al-Baqara 215-217.mp3', 'qurantafseer/002-Al-Baqara 215-217.mp3', NULL, NULL, 2, 215, 217, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(541, '002-Al-Baqara 217-221.mp3', 'qurantafseer/002-Al-Baqara 217-221.mp3', NULL, NULL, 2, 217, 221, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(542, '002-Al-Baqara 222-228.mp3', 'qurantafseer/002-Al-Baqara 222-228.mp3', NULL, NULL, 2, 222, 228, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(543, '002-Al-Baqara 229-233.mp3', 'qurantafseer/002-Al-Baqara 229-233.mp3', NULL, NULL, 2, 229, 233, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(544, '002-Al-Baqara 234-242.mp3', 'qurantafseer/002-Al-Baqara 234-242.mp3', NULL, NULL, 2, 234, 242, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(545, '002-Al-Baqara 243-252.mp3', 'qurantafseer/002-Al-Baqara 243-252.mp3', NULL, NULL, 2, 243, 252, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(546, '002-Al-Baqara 253-254.mp3', 'qurantafseer/002-Al-Baqara 253-254.mp3', NULL, NULL, 2, 253, 254, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(547, '002-Al-Baqara 255.mp3', 'qurantafseer/002-Al-Baqara 255.mp3', NULL, NULL, 2, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(548, '002-Al-Baqara 256-257.mp3', 'qurantafseer/002-Al-Baqara 256-257.mp3', NULL, NULL, 2, 256, 257, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(549, '002-Al-Baqara 258-261.mp3', 'qurantafseer/002-Al-Baqara 258-261.mp3', NULL, NULL, 2, 258, 261, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(550, '002-Al-Baqara 262-267.mp3', 'qurantafseer/002-Al-Baqara 262-267.mp3', NULL, NULL, 2, 262, 267, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(551, '002-Al-Baqara 268-274.mp3', 'qurantafseer/002-Al-Baqara 268-274.mp3', NULL, NULL, 2, 268, 274, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(552, '002-Al-Baqara 275-281.mp3', 'qurantafseer/002-Al-Baqara 275-281.mp3', NULL, NULL, 2, 275, 281, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(553, '002-Al-Baqara 282-283.mp3', 'qurantafseer/002-Al-Baqara 282-283.mp3', NULL, NULL, 2, 282, 283, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(554, '002-Al-Baqara 284-286.mp3', 'qurantafseer/002-Al-Baqara 284-286.mp3', NULL, NULL, 2, 284, 286, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(555, '003-Al-Imran 001-9.mp3', 'qurantafseer/003-Al-Imran 001-9.mp3', NULL, NULL, 3, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(556, '003-Al-Imran 010-18.mp3', 'qurantafseer/003-Al-Imran 010-18.mp3', NULL, NULL, 3, 10, 18, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(557, '003-Al-Imran 019-27.mp3', 'qurantafseer/003-Al-Imran 019-27.mp3', NULL, NULL, 3, 19, 27, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(558, '003-Al-Imran 028-32.mp3', 'qurantafseer/003-Al-Imran 028-32.mp3', NULL, NULL, 3, 28, 32, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(559, '003-Al-Imran 033-47.mp3', 'qurantafseer/003-Al-Imran 033-47.mp3', NULL, NULL, 3, 33, 47, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(560, '003-Al-Imran 048-71.mp3', 'qurantafseer/003-Al-Imran 048-71.mp3', NULL, NULL, 3, 48, 71, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(561, '003-Al-Imran 072-80.mp3', 'qurantafseer/003-Al-Imran 072-80.mp3', NULL, NULL, 3, 72, 80, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(562, '003-Al-Imran 081-91.mp3', 'qurantafseer/003-Al-Imran 081-91.mp3', NULL, NULL, 3, 81, 91, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(563, '003-Al-Imran 092-97.mp3', 'qurantafseer/003-Al-Imran 092-97.mp3', NULL, NULL, 3, 92, 97, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(564, '003-Al-Imran 098-109.mp3', 'qurantafseer/003-Al-Imran 098-109.mp3', NULL, NULL, 3, 98, 109, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(565, '003-Al-Imran 110-120.mp3', 'qurantafseer/003-Al-Imran 110-120.mp3', NULL, NULL, 3, 110, 120, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(566, '003-Al-Imran 121-129.mp3', 'qurantafseer/003-Al-Imran 121-129.mp3', NULL, NULL, 3, 121, 129, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(567, '003-Al-Imran 130-151.mp3', 'qurantafseer/003-Al-Imran 130-151.mp3', NULL, NULL, 3, 130, 151, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(568, '003-Al-Imran 152-155.mp3', 'qurantafseer/003-Al-Imran 152-155.mp3', NULL, NULL, 3, 152, 155, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(569, '003-Al-Imran 156-164.mp3', 'qurantafseer/003-Al-Imran 156-164.mp3', NULL, NULL, 3, 156, 164, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(570, '003-Al-Imran 165-171.mp3', 'qurantafseer/003-Al-Imran 165-171.mp3', NULL, NULL, 3, 165, 171, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(571, '003-Al-Imran 172-180.mp3', 'qurantafseer/003-Al-Imran 172-180.mp3', NULL, NULL, 3, 172, 180, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(572, '003-Al-Imran 181-190.mp3', 'qurantafseer/003-Al-Imran 181-190.mp3', NULL, NULL, 3, 181, 190, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(573, '003-Al-Imran 187-200.mp3', 'qurantafseer/003-Al-Imran 187-200.mp3', NULL, NULL, 3, 187, 200, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(574, '004-An-Nisa 001-3.mp3', 'qurantafseer/004-An-Nisa 001-3.mp3', NULL, NULL, 4, 1, 3, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(575, '004-An-Nisa 004-14.mp3', 'qurantafseer/004-An-Nisa 004-14.mp3', NULL, NULL, 4, 4, 14, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(576, '004-An-Nisa 015-22.mp3', 'qurantafseer/004-An-Nisa 015-22.mp3', NULL, NULL, 4, 15, 22, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(577, '004-An-Nisa 023-28.mp3', 'qurantafseer/004-An-Nisa 023-28.mp3', NULL, NULL, 4, 23, 28, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(578, '004-An-Nisa 029-33.mp3', 'qurantafseer/004-An-Nisa 029-33.mp3', NULL, NULL, 4, 29, 33, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(579, '004-An-Nisa 034-38.mp3', 'qurantafseer/004-An-Nisa 034-38.mp3', NULL, NULL, 4, 34, 38, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(580, '004-An-Nisa 041-46.mp3', 'qurantafseer/004-An-Nisa 041-46.mp3', NULL, NULL, 4, 41, 46, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(581, '004-An-Nisa 047-57.mp3', 'qurantafseer/004-An-Nisa 047-57.mp3', NULL, NULL, 4, 47, 57, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(582, '004-An-Nisa 058-70.mp3', 'qurantafseer/004-An-Nisa 058-70.mp3', NULL, NULL, 4, 58, 70, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(583, '004-An-Nisa 071-79.mp3', 'qurantafseer/004-An-Nisa 071-79.mp3', NULL, NULL, 4, 71, 79, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(584, '004-An-Nisa 080-87.mp3', 'qurantafseer/004-An-Nisa 080-87.mp3', NULL, NULL, 4, 80, 87, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(585, '004-An-Nisa 088-93.mp3', 'qurantafseer/004-An-Nisa 088-93.mp3', NULL, NULL, 4, 88, 93, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(586, '004-An-Nisa 094-101.mp3', 'qurantafseer/004-An-Nisa 094-101.mp3', NULL, NULL, 4, 94, 101, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(587, '004-An-Nisa 101-104.mp3', 'qurantafseer/004-An-Nisa 101-104.mp3', NULL, NULL, 4, 101, 104, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(588, '004-An-Nisa 105-115.mp3', 'qurantafseer/004-An-Nisa 105-115.mp3', NULL, NULL, 4, 105, 115, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(589, '004-An-Nisa 116-118.mp3', 'qurantafseer/004-An-Nisa 116-118.mp3', NULL, NULL, 4, 116, 118, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(590, '004-An-Nisa 119-126.mp3', 'qurantafseer/004-An-Nisa 119-126.mp3', NULL, NULL, 4, 119, 126, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(591, '004-An-Nisa 127-134.mp3', 'qurantafseer/004-An-Nisa 127-134.mp3', NULL, NULL, 4, 127, 134, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(592, '004-An-Nisa 135-147.mp3', 'qurantafseer/004-An-Nisa 135-147.mp3', NULL, NULL, 4, 135, 147, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(593, '004-An-Nisa 148-162.mp3', 'qurantafseer/004-An-Nisa 148-162.mp3', NULL, NULL, 4, 148, 162, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(594, '004-An-Nisa 163-171.mp3', 'qurantafseer/004-An-Nisa 163-171.mp3', NULL, NULL, 4, 163, 171, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(595, '004-An-Nisa 172-176.mp3', 'qurantafseer/004-An-Nisa 172-176.mp3', NULL, NULL, 4, 172, 176, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(596, '005-Al-Maida 001-3.mp3', 'qurantafseer/005-Al-Maida 001-3.mp3', NULL, NULL, 5, 1, 3, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(597, '005-Al-Maida 003-5.mp3', 'qurantafseer/005-Al-Maida 003-5.mp3', NULL, NULL, 5, 3, 5, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(598, '005-Al-Maida 006-11.mp3', 'qurantafseer/005-Al-Maida 006-11.mp3', NULL, NULL, 5, 6, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(599, '005-Al-Maida 012-19.mp3', 'qurantafseer/005-Al-Maida 012-19.mp3', NULL, NULL, 5, 12, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(600, '005-Al-Maida 020-26.mp3', 'qurantafseer/005-Al-Maida 020-26.mp3', NULL, NULL, 5, 20, 26, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(601, '005-Al-Maida 027-34.mp3', 'qurantafseer/005-Al-Maida 027-34.mp3', NULL, NULL, 5, 27, 34, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(602, '005-Al-Maida 035-40.mp3', 'qurantafseer/005-Al-Maida 035-40.mp3', NULL, NULL, 5, 35, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(603, '005-Al-Maida 041-45.mp3', 'qurantafseer/005-Al-Maida 041-45.mp3', NULL, NULL, 5, 41, 45, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(604, '005-Al-Maida 046-53.mp3', 'qurantafseer/005-Al-Maida 046-53.mp3', NULL, NULL, 5, 46, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(605, '005-Al-Maida 054-59.mp3', 'qurantafseer/005-Al-Maida 054-59.mp3', NULL, NULL, 5, 54, 59, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(606, '005-Al-Maida 057-66.mp3', 'qurantafseer/005-Al-Maida 057-66.mp3', NULL, NULL, 5, 57, 66, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(607, '005-Al-Maida 067-77.mp3', 'qurantafseer/005-Al-Maida 067-77.mp3', NULL, NULL, 5, 67, 77, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(608, '005-Al-Maida 078-86.mp3', 'qurantafseer/005-Al-Maida 078-86.mp3', NULL, NULL, 5, 78, 86, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(609, '005-Al-Maida 087-92.mp3', 'qurantafseer/005-Al-Maida 087-92.mp3', NULL, NULL, 5, 87, 92, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(610, '005-Al-Maida 093-100.mp3', 'qurantafseer/005-Al-Maida 093-100.mp3', NULL, NULL, 5, 93, 100, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(611, '005-Al-Maida 101-108.mp3', 'qurantafseer/005-Al-Maida 101-108.mp3', NULL, NULL, 5, 101, 108, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(612, '005-Al-Maida 109-120.mp3', 'qurantafseer/005-Al-Maida 109-120.mp3', NULL, NULL, 5, 109, 120, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(613, '006-Al-Anam 001-6.mp3', 'qurantafseer/006-Al-Anam 001-6.mp3', NULL, NULL, 6, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(614, '006-Al-Anam 007-20.mp3', 'qurantafseer/006-Al-Anam 007-20.mp3', NULL, NULL, 6, 7, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(615, '006-Al-Anam 021-41.mp3', 'qurantafseer/006-Al-Anam 021-41.mp3', NULL, NULL, 6, 21, 41, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(616, '006-Al-Anam 042-55.mp3', 'qurantafseer/006-Al-Anam 042-55.mp3', NULL, NULL, 6, 42, 55, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(617, '006-Al-Anam 056-64.mp3', 'qurantafseer/006-Al-Anam 056-64.mp3', NULL, NULL, 6, 56, 64, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(618, '006-Al-Anam 065-70.mp3', 'qurantafseer/006-Al-Anam 065-70.mp3', NULL, NULL, 6, 65, 70, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(619, '006-Al-Anam 071-83.mp3', 'qurantafseer/006-Al-Anam 071-83.mp3', NULL, NULL, 6, 71, 83, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(620, '006-Al-Anam 084-93.mp3', 'qurantafseer/006-Al-Anam 084-93.mp3', NULL, NULL, 6, 84, 93, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(621, '006-Al-Anam 093-101.mp3', 'qurantafseer/006-Al-Anam 093-101.mp3', NULL, NULL, 6, 93, 101, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(622, '006-Al-Anam 102-110.mp3', 'qurantafseer/006-Al-Anam 102-110.mp3', NULL, NULL, 6, 102, 110, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(623, '006-Al-Anam 111-122.mp3', 'qurantafseer/006-Al-Anam 111-122.mp3', NULL, NULL, 6, 111, 122, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(624, '006-Al-Anam 123-128.mp3', 'qurantafseer/006-Al-Anam 123-128.mp3', NULL, NULL, 6, 123, 128, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(625, '006-Al-Anam 129-137.mp3', 'qurantafseer/006-Al-Anam 129-137.mp3', NULL, NULL, 6, 129, 137, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(626, '006-Al-Anam 138-143.mp3', 'qurantafseer/006-Al-Anam 138-143.mp3', NULL, NULL, 6, 138, 143, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(627, '006-Al-Anam 144-151.mp3', 'qurantafseer/006-Al-Anam 144-151.mp3', NULL, NULL, 6, 144, 151, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(628, '006-Al-Anam 152.mp3', 'qurantafseer/006-Al-Anam 152.mp3', NULL, NULL, 6, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(629, '006-Al-Anam 153-155.mp3', 'qurantafseer/006-Al-Anam 153-155.mp3', NULL, NULL, 6, 153, 155, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(630, '006-Al-Anam 156-159.mp3', 'qurantafseer/006-Al-Anam 156-159.mp3', NULL, NULL, 6, 156, 159, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(631, '006-Al-Anam 160-166.mp3', 'qurantafseer/006-Al-Anam 160-166.mp3', NULL, NULL, 6, 160, 166, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(632, '007-Al-Araf 001-10.mp3', 'qurantafseer/007-Al-Araf 001-10.mp3', NULL, NULL, 7, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(633, '007-Al-Araf 011-25.mp3', 'qurantafseer/007-Al-Araf 011-25.mp3', NULL, NULL, 7, 11, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(634, '007-Al-Araf 026-31.mp3', 'qurantafseer/007-Al-Araf 026-31.mp3', NULL, NULL, 7, 26, 31, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(635, '007-Al-Araf 032-39.mp3', 'qurantafseer/007-Al-Araf 032-39.mp3', NULL, NULL, 7, 32, 39, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(636, '007-Al-Araf 040-47.mp3', 'qurantafseer/007-Al-Araf 040-47.mp3', NULL, NULL, 7, 40, 47, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(637, '007-Al-Araf 048-53.mp3', 'qurantafseer/007-Al-Araf 048-53.mp3', NULL, NULL, 7, 48, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(638, '007-Al-Araf 054-56.mp3', 'qurantafseer/007-Al-Araf 054-56.mp3', NULL, NULL, 7, 54, 56, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(639, '007-Al-Araf 057-64.mp3', 'qurantafseer/007-Al-Araf 057-64.mp3', NULL, NULL, 7, 57, 64, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(640, '007-Al-Araf 065-79.mp3', 'qurantafseer/007-Al-Araf 065-79.mp3', NULL, NULL, 7, 65, 79, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(641, '007-Al-Araf 073-85.mp3', 'qurantafseer/007-Al-Araf 073-85.mp3', NULL, NULL, 7, 73, 85, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(642, '007-Al-Araf 085-93.mp3', 'qurantafseer/007-Al-Araf 085-93.mp3', NULL, NULL, 7, 85, 93, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(643, '007-Al-Araf 094-102.mp3', 'qurantafseer/007-Al-Araf 094-102.mp3', NULL, NULL, 7, 94, 102, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(644, '007-Al-Araf 103-129.mp3', 'qurantafseer/007-Al-Araf 103-129.mp3', NULL, NULL, 7, 103, 129, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(645, '007-Al-Araf 130-141.mp3', 'qurantafseer/007-Al-Araf 130-141.mp3', NULL, NULL, 7, 130, 141, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(646, '007-Al-Araf 142-149.mp3', 'qurantafseer/007-Al-Araf 142-149.mp3', NULL, NULL, 7, 142, 149, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(647, '007-Al-Araf 150-157.mp3', 'qurantafseer/007-Al-Araf 150-157.mp3', NULL, NULL, 7, 150, 157, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(648, '007-Al-Araf 158-162.mp3', 'qurantafseer/007-Al-Araf 158-162.mp3', NULL, NULL, 7, 158, 162, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(649, '007-Al-Araf 163-171.mp3', 'qurantafseer/007-Al-Araf 163-171.mp3', NULL, NULL, 7, 163, 171, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(650, '007-Al-Araf 172-176.mp3', 'qurantafseer/007-Al-Araf 172-176.mp3', NULL, NULL, 7, 172, 176, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(651, '007-Al-Araf 177-200.mp3', 'qurantafseer/007-Al-Araf 177-200.mp3', NULL, NULL, 7, 177, 200, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(652, '007-Al-Araf 201-206.mp3', 'qurantafseer/007-Al-Araf 201-206.mp3', NULL, NULL, 7, 201, 206, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(653, '008-Al-Anfal 001-10.mp3', 'qurantafseer/008-Al-Anfal 001-10.mp3', NULL, NULL, 8, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(654, '008-Al-Anfal 011-19.mp3', 'qurantafseer/008-Al-Anfal 011-19.mp3', NULL, NULL, 8, 11, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(655, '008-Al-Anfal 020-28.mp3', 'qurantafseer/008-Al-Anfal 020-28.mp3', NULL, NULL, 8, 20, 28, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(656, '008-Al-Anfal 029-37.mp3', 'qurantafseer/008-Al-Anfal 029-37.mp3', NULL, NULL, 8, 29, 37, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(657, '008-Al-Anfal 037-44.mp3', 'qurantafseer/008-Al-Anfal 037-44.mp3', NULL, NULL, 8, 37, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(658, '008-Al-Anfal 045-48.mp3', 'qurantafseer/008-Al-Anfal 045-48.mp3', NULL, NULL, 8, 45, 48, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(659, '008-Al-Anfal 049-60.mp3', 'qurantafseer/008-Al-Anfal 049-60.mp3', NULL, NULL, 8, 49, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(660, '008-Al-Anfal 061-66.mp3', 'qurantafseer/008-Al-Anfal 061-66.mp3', NULL, NULL, 8, 61, 66, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(661, '008-Al-Anfal 067-75.mp3', 'qurantafseer/008-Al-Anfal 067-75.mp3', NULL, NULL, 8, 67, 75, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(662, '009-At-Taubah 001-6.mp3', 'qurantafseer/009-At-Taubah 001-6.mp3', NULL, NULL, 9, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(663, '009-At-Taubah 007-16.mp3', 'qurantafseer/009-At-Taubah 007-16.mp3', NULL, NULL, 9, 7, 16, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(664, '009-At-Taubah 017-24.mp3', 'qurantafseer/009-At-Taubah 017-24.mp3', NULL, NULL, 9, 17, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(665, '009-At-Taubah 025-28.mp3', 'qurantafseer/009-At-Taubah 025-28.mp3', NULL, NULL, 9, 25, 28, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(666, '009-At-Taubah 029-40.mp3', 'qurantafseer/009-At-Taubah 029-40.mp3', NULL, NULL, 9, 29, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(667, '009-At-Taubah 041-57.mp3', 'qurantafseer/009-At-Taubah 041-57.mp3', NULL, NULL, 9, 41, 57, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(668, '009-At-Taubah 058-61.mp3', 'qurantafseer/009-At-Taubah 058-61.mp3', NULL, NULL, 9, 58, 61, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(669, '009-At-Taubah 062-72.mp3', 'qurantafseer/009-At-Taubah 062-72.mp3', NULL, NULL, 9, 62, 72, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(670, '009-At-Taubah 073-80.mp3', 'qurantafseer/009-At-Taubah 073-80.mp3', NULL, NULL, 9, 73, 80, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(671, '009-At-Taubah 081-89.mp3', 'qurantafseer/009-At-Taubah 081-89.mp3', NULL, NULL, 9, 81, 89, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(672, '009-At-Taubah 090-99.mp3', 'qurantafseer/009-At-Taubah 090-99.mp3', NULL, NULL, 9, 90, 99, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(673, '009-At-Taubah 100-106.mp3', 'qurantafseer/009-At-Taubah 100-106.mp3', NULL, NULL, 9, 100, 106, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(674, '009-At-Taubah 107-112.mp3', 'qurantafseer/009-At-Taubah 107-112.mp3', NULL, NULL, 9, 107, 112, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(675, '009-At-Taubah 113-121.mp3', 'qurantafseer/009-At-Taubah 113-121.mp3', NULL, NULL, 9, 113, 121, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(676, '009-At-Taubah 122-129.mp3', 'qurantafseer/009-At-Taubah 122-129.mp3', NULL, NULL, 9, 122, 129, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(677, '010-Yunus 001-7.mp3', 'qurantafseer/010-Yunus 001-7.mp3', NULL, NULL, 10, 1, 7, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(678, '010-Yunus 008-17.mp3', 'qurantafseer/010-Yunus 008-17.mp3', NULL, NULL, 10, 8, 17, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(679, '010-Yunus 018-25.mp3', 'qurantafseer/010-Yunus 018-25.mp3', NULL, NULL, 10, 18, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(680, '010-Yunus 026-32.mp3', 'qurantafseer/010-Yunus 026-32.mp3', NULL, NULL, 10, 26, 32, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(681, '010-Yunus 033-53.mp3', 'qurantafseer/010-Yunus 033-53.mp3', NULL, NULL, 10, 33, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(682, '010-Yunus 054-61.mp3', 'qurantafseer/010-Yunus 054-61.mp3', NULL, NULL, 10, 54, 61, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(683, '010-Yunus 062-70.mp3', 'qurantafseer/010-Yunus 062-70.mp3', NULL, NULL, 10, 62, 70, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(684, '010-Yunus 071-103.mp3', 'qurantafseer/010-Yunus 071-103.mp3', NULL, NULL, 10, 71, 103, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(685, '010-Yunus 104-109.mp3', 'qurantafseer/010-Yunus 104-109.mp3', NULL, NULL, 10, 104, 109, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(686, '011-Hud 001-8.mp3', 'qurantafseer/011-Hud 001-8.mp3', NULL, NULL, 11, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(687, '011-Hud 09-24.mp3', 'qurantafseer/011-Hud 09-24.mp3', NULL, NULL, 11, 9, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(688, '011-Hud 025-35.mp3', 'qurantafseer/011-Hud 025-35.mp3', NULL, NULL, 11, 25, 35, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(689, '011-Hud 036-49.mp3', 'qurantafseer/011-Hud 036-49.mp3', NULL, NULL, 11, 36, 49, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(690, '011-Hud 050-60.mp3', 'qurantafseer/011-Hud 050-60.mp3', NULL, NULL, 11, 50, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(691, '011-Hud 061-68.mp3', 'qurantafseer/011-Hud 061-68.mp3', NULL, NULL, 11, 61, 68, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(692, '011-Hud 069-83.mp3', 'qurantafseer/011-Hud 069-83.mp3', NULL, NULL, 11, 69, 83, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(693, '011-Hud 084-95.mp3', 'qurantafseer/011-Hud 084-95.mp3', NULL, NULL, 11, 84, 95, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(694, '011-Hud 096-109.mp3', 'qurantafseer/011-Hud 096-109.mp3', NULL, NULL, 11, 96, 109, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(695, '011-Hud 110-115.mp3', 'qurantafseer/011-Hud 110-115.mp3', NULL, NULL, 11, 110, 115, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(696, '011-Hud 115-123.mp3', 'qurantafseer/011-Hud 115-123.mp3', NULL, NULL, 11, 115, 123, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(697, '012-Yousuf 001-6.mp3', 'qurantafseer/012-Yousuf 001-6.mp3', NULL, NULL, 12, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(698, '012-Yousuf 007-20.mp3', 'qurantafseer/012-Yousuf 007-20.mp3', NULL, NULL, 12, 7, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(699, '012-Yousuf 021-29.mp3', 'qurantafseer/012-Yousuf 021-29.mp3', NULL, NULL, 12, 21, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(700, '012-Yousuf 030-42.mp3', 'qurantafseer/012-Yousuf 030-42.mp3', NULL, NULL, 12, 30, 42, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(701, '012-Yousuf 042-53.mp3', 'qurantafseer/012-Yousuf 042-53.mp3', NULL, NULL, 12, 42, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(702, '012-Yousuf 053-57.mp3', 'qurantafseer/012-Yousuf 053-57.mp3', NULL, NULL, 12, 53, 57, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(703, '012-Yousuf 058-67.mp3', 'qurantafseer/012-Yousuf 058-67.mp3', NULL, NULL, 12, 58, 67, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(704, '012-Yousuf 068-79.mp3', 'qurantafseer/012-Yousuf 068-79.mp3', NULL, NULL, 12, 68, 79, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(705, '012-Yousuf 080-93.mp3', 'qurantafseer/012-Yousuf 080-93.mp3', NULL, NULL, 12, 80, 93, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(706, '012-Yousuf 093-101.mp3', 'qurantafseer/012-Yousuf 093-101.mp3', NULL, NULL, 12, 93, 101, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(707, '012-Yousuf 102-111.mp3', 'qurantafseer/012-Yousuf 102-111.mp3', NULL, NULL, 12, 102, 111, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(708, '013-Ar-Ra\'ad 01-6.mp3', 'qurantafseer/013-Ar-Ra\'ad 01-6.mp3', NULL, NULL, 13, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(709, '013-Ar-Ra\'ad 07-12.mp3', 'qurantafseer/013-Ar-Ra\'ad 07-12.mp3', NULL, NULL, 13, 7, 12, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(710, '013-Ar-Ra\'ad 13-18.mp3', 'qurantafseer/013-Ar-Ra\'ad 13-18.mp3', NULL, NULL, 13, 13, 18, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(711, '013-Ar-Ra\'ad 19-25.mp3', 'qurantafseer/013-Ar-Ra\'ad 19-25.mp3', NULL, NULL, 13, 19, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(712, '013-Ar-Ra\'ad 26-29.mp3', 'qurantafseer/013-Ar-Ra\'ad 26-29.mp3', NULL, NULL, 13, 26, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(713, '013-Ar-Ra\'ad 30-37.mp3', 'qurantafseer/013-Ar-Ra\'ad 30-37.mp3', NULL, NULL, 13, 30, 37, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(714, '013-Ar-Ra\'ad 38-43.mp3', 'qurantafseer/013-Ar-Ra\'ad 38-43.mp3', NULL, NULL, 13, 38, 43, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(715, '014-Ibrahim 01-4.mp3', 'qurantafseer/014-Ibrahim 01-4.mp3', NULL, NULL, 14, 1, 4, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(716, '014-Ibrahim 05-21.mp3', 'qurantafseer/014-Ibrahim 05-21.mp3', NULL, NULL, 14, 5, 21, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(717, '014-Ibrahim 22-27.mp3', 'qurantafseer/014-Ibrahim 22-27.mp3', NULL, NULL, 14, 22, 27, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(718, '014-Ibrahim 28-34.mp3', 'qurantafseer/014-Ibrahim 28-34.mp3', NULL, NULL, 14, 28, 34, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(719, '014-Ibrahim 35-41.mp3', 'qurantafseer/014-Ibrahim 35-41.mp3', NULL, NULL, 14, 35, 41, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(720, '014-Ibrahim 42-52.mp3', 'qurantafseer/014-Ibrahim 42-52.mp3', NULL, NULL, 14, 42, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(721, '015-Al-Hijr 01-25.mp3', 'qurantafseer/015-Al-Hijr 01-25.mp3', NULL, NULL, 15, 1, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(722, '015-Al-Hijr 26-44.mp3', 'qurantafseer/015-Al-Hijr 26-44.mp3', NULL, NULL, 15, 26, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(723, '015-Al-Hijr 45-78.mp3', 'qurantafseer/015-Al-Hijr 45-78.mp3', NULL, NULL, 15, 45, 78, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(724, '015-Al-Hijr 79-99.mp3', 'qurantafseer/015-Al-Hijr 79-99.mp3', NULL, NULL, 15, 79, 99, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(725, '016-An-Nahal 001-9.mp3', 'qurantafseer/016-An-Nahal 001-9.mp3', NULL, NULL, 16, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(726, '016-An-Nahal 010-25.mp3', 'qurantafseer/016-An-Nahal 010-25.mp3', NULL, NULL, 16, 10, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(727, '016-An-Nahal 026-40.mp3', 'qurantafseer/016-An-Nahal 026-40.mp3', NULL, NULL, 16, 26, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(728, '016-An-Nahal 041-44.mp3', 'qurantafseer/016-An-Nahal 041-44.mp3', NULL, NULL, 16, 41, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(729, '016-An-Nahal 045-60.mp3', 'qurantafseer/016-An-Nahal 045-60.mp3', NULL, NULL, 16, 45, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(730, '016-An-Nahal 061-70.mp3', 'qurantafseer/016-An-Nahal 061-70.mp3', NULL, NULL, 16, 61, 70, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(731, '016-An-Nahal 071-83.mp3', 'qurantafseer/016-An-Nahal 071-83.mp3', NULL, NULL, 16, 71, 83, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(732, '016-An-Nahal 084-90.mp3', 'qurantafseer/016-An-Nahal 084-90.mp3', NULL, NULL, 16, 84, 90, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(733, '016-An-Nahal 098-110.mp3', 'qurantafseer/016-An-Nahal 098-110.mp3', NULL, NULL, 16, 98, 110, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(734, '016-An-Nahal 111-128.mp3', 'qurantafseer/016-An-Nahal 111-128.mp3', NULL, NULL, 16, 111, 128, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(735, '017-Bani-Israel 001-8.mp3', 'qurantafseer/017-Bani-Israel 001-8.mp3', NULL, NULL, 17, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(736, '017-Bani-Israel 009-15.mp3', 'qurantafseer/017-Bani-Israel 009-15.mp3', NULL, NULL, 17, 9, 15, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(737, '017-Bani-Israel 016-24.mp3', 'qurantafseer/017-Bani-Israel 016-24.mp3', NULL, NULL, 17, 16, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(738, '017-Bani-Israel 025-30.mp3', 'qurantafseer/017-Bani-Israel 025-30.mp3', NULL, NULL, 17, 25, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(739, '017-Bani-Israel 031-40.mp3', 'qurantafseer/017-Bani-Israel 031-40.mp3', NULL, NULL, 17, 31, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(740, '017-Bani-Israel 041-52.mp3', 'qurantafseer/017-Bani-Israel 041-52.mp3', NULL, NULL, 17, 41, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(741, '017-Bani-Israel 053-65.mp3', 'qurantafseer/017-Bani-Israel 053-65.mp3', NULL, NULL, 17, 53, 65, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(742, '017-Bani-Israel 066-77.mp3', 'qurantafseer/017-Bani-Israel 066-77.mp3', NULL, NULL, 17, 66, 77, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(743, '017-Bani-Israel 077-84.mp3', 'qurantafseer/017-Bani-Israel 077-84.mp3', NULL, NULL, 17, 77, 84, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(744, '017-Bani-Israel 085-100.mp3', 'qurantafseer/017-Bani-Israel 085-100.mp3', NULL, NULL, 17, 85, 100, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(745, '017-Bani-Israel 101-111.mp3', 'qurantafseer/017-Bani-Israel 101-111.mp3', NULL, NULL, 17, 101, 111, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(746, '018-Al-Kahaf 001-17.mp3', 'qurantafseer/018-Al-Kahaf 001-17.mp3', NULL, NULL, 18, 1, 17, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(747, '018-Al-Kahaf 018-26.mp3', 'qurantafseer/018-Al-Kahaf 018-26.mp3', NULL, NULL, 18, 18, 26, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(748, '018-Al-Kahaf 027-44.mp3', 'qurantafseer/018-Al-Kahaf 027-44.mp3', NULL, NULL, 18, 27, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(749, '018-Al-Kahaf 045-53.mp3', 'qurantafseer/018-Al-Kahaf 045-53.mp3', NULL, NULL, 18, 45, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(750, '018-Al-Kahaf 054-59.mp3', 'qurantafseer/018-Al-Kahaf 054-59.mp3', NULL, NULL, 18, 54, 59, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(751, '018-Al-Kahaf 060-82.mp3', 'qurantafseer/018-Al-Kahaf 060-82.mp3', NULL, NULL, 18, 60, 82, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(752, '018-Al-Kahaf 083-101.mp3', 'qurantafseer/018-Al-Kahaf 083-101.mp3', NULL, NULL, 18, 83, 101, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(753, '018-Al-Kahaf 102-110.mp3', 'qurantafseer/018-Al-Kahaf 102-110.mp3', NULL, NULL, 18, 102, 110, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(754, '019-Maryam 01-15.mp3', 'qurantafseer/019-Maryam 01-15.mp3', NULL, NULL, 19, 1, 15, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(755, '019-Maryam 16-40.mp3', 'qurantafseer/019-Maryam 16-40.mp3', NULL, NULL, 19, 16, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(756, '019-Maryam 41-50.mp3', 'qurantafseer/019-Maryam 41-50.mp3', NULL, NULL, 19, 41, 50, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(757, '019-Maryam 51-65.mp3', 'qurantafseer/019-Maryam 51-65.mp3', NULL, NULL, 19, 51, 65, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(758, '019-Maryam 66-82.mp3', 'qurantafseer/019-Maryam 66-82.mp3', NULL, NULL, 19, 66, 82, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(759, '019-Maryam 83-98.mp3', 'qurantafseer/019-Maryam 83-98.mp3', NULL, NULL, 19, 83, 98, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(760, '020-Taha 001-24.mp3', 'qurantafseer/020-Taha 001-24.mp3', NULL, NULL, 20, 1, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(761, '020-Taha 025-54.mp3', 'qurantafseer/020-Taha 025-54.mp3', NULL, NULL, 20, 25, 54, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(762, '020-Taha 055-76.mp3', 'qurantafseer/020-Taha 055-76.mp3', NULL, NULL, 20, 55, 76, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(763, '020-Taha 077-89.mp3', 'qurantafseer/020-Taha 077-89.mp3', NULL, NULL, 20, 77, 89, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(764, '020-Taha 090-104.mp3', 'qurantafseer/020-Taha 090-104.mp3', NULL, NULL, 20, 90, 104, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(765, '020-Taha 105-115.mp3', 'qurantafseer/020-Taha 105-115.mp3', NULL, NULL, 20, 105, 115, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(766, '020-Taha 116-128.mp3', 'qurantafseer/020-Taha 116-128.mp3', NULL, NULL, 20, 116, 128, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(767, '020-Taha 129-135.mp3', 'qurantafseer/020-Taha 129-135.mp3', NULL, NULL, 20, 129, 135, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(768, '021-Al-Anbiya 01-10.mp3', 'qurantafseer/021-Al-Anbiya 01-10.mp3', NULL, NULL, 21, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(769, '021-Al-Anbiya 11-29.mp3', 'qurantafseer/021-Al-Anbiya 11-29.mp3', NULL, NULL, 21, 11, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(770, '021-Al-Anbiya 30-41.mp3', 'qurantafseer/021-Al-Anbiya 30-41.mp3', NULL, NULL, 21, 30, 41, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(771, '021-Al-Anbiya 42-50.mp3', 'qurantafseer/021-Al-Anbiya 42-50.mp3', NULL, NULL, 21, 42, 50, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(772, '021-Al-Anbiya 51-75.mp3', 'qurantafseer/021-Al-Anbiya 51-75.mp3', NULL, NULL, 21, 51, 75, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(773, '021-Al-Anbiya 76-93.mp3', 'qurantafseer/021-Al-Anbiya 76-93.mp3', NULL, NULL, 21, 76, 93, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(774, '021-Al-Anbiya 94-112.mp3', 'qurantafseer/021-Al-Anbiya 94-112.mp3', NULL, NULL, 21, 94, 112, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(775, '022-Al-Hajj 01-10.mp3', 'qurantafseer/022-Al-Hajj 01-10.mp3', NULL, NULL, 22, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(776, '022-Al-Hajj 11-25.mp3', 'qurantafseer/022-Al-Hajj 11-25.mp3', NULL, NULL, 22, 11, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(777, '022-Al-Hajj 26-33.mp3', 'qurantafseer/022-Al-Hajj 26-33.mp3', NULL, NULL, 22, 26, 33, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(778, '022-Al-Hajj 34-38.mp3', 'qurantafseer/022-Al-Hajj 34-38.mp3', NULL, NULL, 22, 34, 38, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(779, '022-Al-Hajj 39-51.mp3', 'qurantafseer/022-Al-Hajj 39-51.mp3', NULL, NULL, 22, 39, 51, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(780, '022-Al-Hajj 52-57.mp3', 'qurantafseer/022-Al-Hajj 52-57.mp3', NULL, NULL, 22, 52, 57, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(781, '022-Al-Hajj 58-69.mp3', 'qurantafseer/022-Al-Hajj 58-69.mp3', NULL, NULL, 22, 58, 69, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(782, '022-Al-Hajj 70-78.mp3', 'qurantafseer/022-Al-Hajj 70-78.mp3', NULL, NULL, 22, 70, 78, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(783, '023-Al-Muminun 01-22.mp3', 'qurantafseer/023-Al-Muminun 01-22.mp3', NULL, NULL, 23, 1, 22, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(784, '023-Al-Muminun 23-50.mp3', 'qurantafseer/023-Al-Muminun 23-50.mp3', NULL, NULL, 23, 23, 50, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(785, '023-Al-Muminun 51-77.mp3', 'qurantafseer/023-Al-Muminun 51-77.mp3', NULL, NULL, 23, 51, 77, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(786, '023-Al-Muminun 78-118.mp3', 'qurantafseer/023-Al-Muminun 78-118.mp3', NULL, NULL, 23, 78, 118, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(787, '024-An-Nur 01-10.mp3', 'qurantafseer/024-An-Nur 01-10.mp3', NULL, NULL, 24, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(788, '024-An-Nur 11-20.mp3', 'qurantafseer/024-An-Nur 11-20.mp3', NULL, NULL, 24, 11, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(789, '024-An-Nur 21-26.mp3', 'qurantafseer/024-An-Nur 21-26.mp3', NULL, NULL, 24, 21, 26, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(790, '024-An-Nur 27-30.mp3', 'qurantafseer/024-An-Nur 27-30.mp3', NULL, NULL, 24, 27, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(791, '024-An-Nur 31-34.mp3', 'qurantafseer/024-An-Nur 31-34.mp3', NULL, NULL, 24, 31, 34, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(792, '024-An-Nur 35-40.mp3', 'qurantafseer/024-An-Nur 35-40.mp3', NULL, NULL, 24, 35, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(793, '024-An-Nur 41-54.mp3', 'qurantafseer/024-An-Nur 41-54.mp3', NULL, NULL, 24, 41, 54, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(794, '024-An-Nur 55-60.mp3', 'qurantafseer/024-An-Nur 55-60.mp3', NULL, NULL, 24, 55, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(795, '024-An-Nur 61-64.mp3', 'qurantafseer/024-An-Nur 61-64.mp3', NULL, NULL, 24, 61, 64, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(796, '025-Al-Furqan 01-9.mp3', 'qurantafseer/025-Al-Furqan 01-9.mp3', NULL, NULL, 25, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(797, '025-Al-Furqan 10-20.mp3', 'qurantafseer/025-Al-Furqan 10-20.mp3', NULL, NULL, 25, 10, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(798, '025-Al-Furqan 21-34.mp3', 'qurantafseer/025-Al-Furqan 21-34.mp3', NULL, NULL, 25, 21, 34, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(799, '025-Al-Furqan 35-44.mp3', 'qurantafseer/025-Al-Furqan 35-44.mp3', NULL, NULL, 25, 35, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(800, '025-Al-Furqan 45-60.mp3', 'qurantafseer/025-Al-Furqan 45-60.mp3', NULL, NULL, 25, 45, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(801, '025-Al-Furqan 61-77.mp3', 'qurantafseer/025-Al-Furqan 61-77.mp3', NULL, NULL, 25, 61, 77, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(802, '026-Ash-Shuara 001-33.mp3', 'qurantafseer/026-Ash-Shuara 001-33.mp3', NULL, NULL, 26, 1, 33, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(803, '026-Ash-Shuara 034-68.mp3', 'qurantafseer/026-Ash-Shuara 034-68.mp3', NULL, NULL, 26, 34, 68, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(804, '026-Ash-Shuara 069-104.mp3', 'qurantafseer/026-Ash-Shuara 069-104.mp3', NULL, NULL, 26, 69, 104, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(805, '026-Ash-Shuara 105-140.mp3', 'qurantafseer/026-Ash-Shuara 105-140.mp3', NULL, NULL, 26, 105, 140, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(806, '026-Ash-Shuara 141-175.mp3', 'qurantafseer/026-Ash-Shuara 141-175.mp3', NULL, NULL, 26, 141, 175, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(807, '026-Ash-Shuara 176-191.mp3', 'qurantafseer/026-Ash-Shuara 176-191.mp3', NULL, NULL, 26, 176, 191, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(808, '026-Ash-Shuara 192-227.mp3', 'qurantafseer/026-Ash-Shuara 192-227.mp3', NULL, NULL, 26, 192, 227, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(809, '027-An-Namal 01-14.mp3', 'qurantafseer/027-An-Namal 01-14.mp3', NULL, NULL, 27, 1, 14, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(810, '027-An-Namal 15-31.mp3', 'qurantafseer/027-An-Namal 15-31.mp3', NULL, NULL, 27, 15, 31, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(811, '027-An-Namal 32-44.mp3', 'qurantafseer/027-An-Namal 32-44.mp3', NULL, NULL, 27, 32, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(812, '027-An-Namal 45-59.mp3', 'qurantafseer/027-An-Namal 45-59.mp3', NULL, NULL, 27, 45, 59, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(813, '027-An-Namal 60-66.mp3', 'qurantafseer/027-An-Namal 60-66.mp3', NULL, NULL, 27, 60, 66, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(814, '027-An-Namal 67-82.mp3', 'qurantafseer/027-An-Namal 67-82.mp3', NULL, NULL, 27, 67, 82, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(815, '027-An-Namal 83-93.mp3', 'qurantafseer/027-An-Namal 83-93.mp3', NULL, NULL, 27, 83, 93, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(816, '028-Al-Qasas 01- 13.mp3', 'qurantafseer/028-Al-Qasas 01- 13.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(817, '028-Al-Qasas 14- 28.mp3', 'qurantafseer/028-Al-Qasas 14- 28.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05');
INSERT INTO `quran_audio` (`id`, `filename`, `filepath`, `file_size`, `duration_seconds`, `surah_no`, `ayah_start`, `ayah_end`, `reciter`, `language`, `bitrate`, `is_active`, `created_at`, `updated_at`) VALUES
(818, '028-Al-Qasas 29- 42.mp3', 'qurantafseer/028-Al-Qasas 29- 42.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(819, '028-Al-Qasas 43- 50.mp3', 'qurantafseer/028-Al-Qasas 43- 50.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(820, '028-Al-Qasas 51- 60.mp3', 'qurantafseer/028-Al-Qasas 51- 60.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(821, '028-Al-Qasas 61- 75.mp3', 'qurantafseer/028-Al-Qasas 61- 75.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(822, '028-Al-Qasas 76- 88.mp3', 'qurantafseer/028-Al-Qasas 76- 88.mp3', NULL, NULL, 28, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(823, '029-Al-Ankabut 01-13.mp3', 'qurantafseer/029-Al-Ankabut 01-13.mp3', NULL, NULL, 29, 1, 13, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(824, '029-Al-Ankabut 14-22.mp3', 'qurantafseer/029-Al-Ankabut 14-22.mp3', NULL, NULL, 29, 14, 22, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(825, '029-Al-Ankabut 23-44.mp3', 'qurantafseer/029-Al-Ankabut 23-44.mp3', NULL, NULL, 29, 23, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(826, '029-Al-Ankabut 45-51.mp3', 'qurantafseer/029-Al-Ankabut 45-51.mp3', NULL, NULL, 29, 45, 51, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(827, '029-Al-Ankabut 52-63.mp3', 'qurantafseer/029-Al-Ankabut 52-63.mp3', NULL, NULL, 29, 52, 63, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(828, '029-Al-Ankabut 64-69.mp3', 'qurantafseer/029-Al-Ankabut 64-69.mp3', NULL, NULL, 29, 64, 69, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(829, '030-Ar-Rum 01-10.mp3', 'qurantafseer/030-Ar-Rum 01-10.mp3', NULL, NULL, 30, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(830, '030-Ar-Rum 11-19.mp3', 'qurantafseer/030-Ar-Rum 11-19.mp3', NULL, NULL, 30, 11, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(831, '030-Ar-Rum 20-27.mp3', 'qurantafseer/030-Ar-Rum 20-27.mp3', NULL, NULL, 30, 20, 27, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(832, '030-Ar-Rum 28-40.mp3', 'qurantafseer/030-Ar-Rum 28-40.mp3', NULL, NULL, 30, 28, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(833, '030-Ar-Rum 41-53.mp3', 'qurantafseer/030-Ar-Rum 41-53.mp3', NULL, NULL, 30, 41, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(834, '030-Ar-Rum 54-60.mp3', 'qurantafseer/030-Ar-Rum 54-60.mp3', NULL, NULL, 30, 54, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(835, '031-Luqman 01-11.mp3', 'qurantafseer/031-Luqman 01-11.mp3', NULL, NULL, 31, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(836, '031-Luqman 12-19.mp3', 'qurantafseer/031-Luqman 12-19.mp3', NULL, NULL, 31, 12, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(837, '031-Luqman 20-30.mp3', 'qurantafseer/031-Luqman 20-30.mp3', NULL, NULL, 31, 20, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(838, '031-Luqman 31-34.mp3', 'qurantafseer/031-Luqman 31-34.mp3', NULL, NULL, 31, 31, 34, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(839, '032-As-Sajda 01-11.mp3', 'qurantafseer/032-As-Sajda 01-11.mp3', NULL, NULL, 32, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(840, '032-As-Sajda 12-30.mp3', 'qurantafseer/032-As-Sajda 12-30.mp3', NULL, NULL, 32, 12, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(841, '033-Al-Ahzab 01-8.mp3', 'qurantafseer/033-Al-Ahzab 01-8.mp3', NULL, NULL, 33, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(842, '033-Al-Ahzab 09-20.mp3', 'qurantafseer/033-Al-Ahzab 09-20.mp3', NULL, NULL, 33, 9, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(843, '033-Al-Ahzab 21-27.mp3', 'qurantafseer/033-Al-Ahzab 21-27.mp3', NULL, NULL, 33, 21, 27, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(844, '033-Al-Ahzab 28-34.mp3', 'qurantafseer/033-Al-Ahzab 28-34.mp3', NULL, NULL, 33, 28, 34, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(845, '033-Al-Ahzab 35-40.mp3', 'qurantafseer/033-Al-Ahzab 35-40.mp3', NULL, NULL, 33, 35, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(846, '033-Al-Ahzab 40-48.mp3', 'qurantafseer/033-Al-Ahzab 40-48.mp3', NULL, NULL, 33, 40, 48, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(847, '033-Al-Ahzab 49-52.mp3', 'qurantafseer/033-Al-Ahzab 49-52.mp3', NULL, NULL, 33, 49, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(848, '033-Al-Ahzab 53-58.mp3', 'qurantafseer/033-Al-Ahzab 53-58.mp3', NULL, NULL, 33, 53, 58, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(849, '033-Al-Ahzab 59-73.mp3', 'qurantafseer/033-Al-Ahzab 59-73.mp3', NULL, NULL, 33, 59, 73, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(850, '034-Saba 01-9.mp3', 'qurantafseer/034-Saba 01-9.mp3', NULL, NULL, 34, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(851, '034-Saba 10-14.mp3', 'qurantafseer/034-Saba 10-14.mp3', NULL, NULL, 34, 10, 14, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(852, '034-Saba 15-21.mp3', 'qurantafseer/034-Saba 15-21.mp3', NULL, NULL, 34, 15, 21, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(853, '034-Saba 22-37.mp3', 'qurantafseer/034-Saba 22-37.mp3', NULL, NULL, 34, 22, 37, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(854, '034-Saba 38-54.mp3', 'qurantafseer/034-Saba 38-54.mp3', NULL, NULL, 34, 38, 54, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(855, '035-Faatir 01-7.mp3', 'qurantafseer/035-Faatir 01-7.mp3', NULL, NULL, 35, 1, 7, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(856, '035-Faatir 8-14.mp3', 'qurantafseer/035-Faatir 8-14.mp3', NULL, NULL, 35, 8, 14, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(857, '035-Faatir 15-26.mp3', 'qurantafseer/035-Faatir 15-26.mp3', NULL, NULL, 35, 15, 26, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(858, '035-Faatir 27-37.mp3', 'qurantafseer/035-Faatir 27-37.mp3', NULL, NULL, 35, 27, 37, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(859, '035-Faatir 38-45.mp3', 'qurantafseer/035-Faatir 38-45.mp3', NULL, NULL, 35, 38, 45, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(860, '036-Yaasiin 01-12.mp3', 'qurantafseer/036-Yaasiin 01-12.mp3', NULL, NULL, 36, 1, 12, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(861, '036-Yaasiin 13-32.mp3', 'qurantafseer/036-Yaasiin 13-32.mp3', NULL, NULL, 36, 13, 32, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(862, '036-Yaasiin 33-50.mp3', 'qurantafseer/036-Yaasiin 33-50.mp3', NULL, NULL, 36, 33, 50, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(863, '036-Yaasiin 51-83.mp3', 'qurantafseer/036-Yaasiin 51-83.mp3', NULL, NULL, 36, 51, 83, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(864, '037-As-Saffaat 01-21.mp3', 'qurantafseer/037-As-Saffaat 01-21.mp3', NULL, NULL, 37, 1, 21, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(865, '037-As-Saffaat 22-61.mp3', 'qurantafseer/037-As-Saffaat 22-61.mp3', NULL, NULL, 37, 22, 61, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(866, '037-As-Saffaat 62-82.mp3', 'qurantafseer/037-As-Saffaat 62-82.mp3', NULL, NULL, 37, 62, 82, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(867, '037-As-Saffaat 83-113.mp3', 'qurantafseer/037-As-Saffaat 83-113.mp3', NULL, NULL, 37, 83, 113, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(868, '037-As-Saffaat 114-138.mp3', 'qurantafseer/037-As-Saffaat 114-138.mp3', NULL, NULL, 37, 114, 138, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(869, '037-As-Saffaat 139-182.mp3', 'qurantafseer/037-As-Saffaat 139-182.mp3', NULL, NULL, 37, 139, 182, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(870, '038-Saad 01-26.mp3', 'qurantafseer/038-Saad 01-26.mp3', NULL, NULL, 38, 1, 26, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(871, '038-Saad 27-40.mp3', 'qurantafseer/038-Saad 27-40.mp3', NULL, NULL, 38, 27, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(872, '038-Saad 41-64.mp3', 'qurantafseer/038-Saad 41-64.mp3', NULL, NULL, 38, 41, 64, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(873, '038-Saad 65-88.mp3', 'qurantafseer/038-Saad 65-88.mp3', NULL, NULL, 38, 65, 88, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(874, '039-Az-Zumar 01-9.mp3', 'qurantafseer/039-Az-Zumar 01-9.mp3', NULL, NULL, 39, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(875, '039-Az-Zumar 10-21.mp3', 'qurantafseer/039-Az-Zumar 10-21.mp3', NULL, NULL, 39, 10, 21, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(876, '039-Az-Zumar 22-31.mp3', 'qurantafseer/039-Az-Zumar 22-31.mp3', NULL, NULL, 39, 22, 31, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(877, '039-Az-Zumar 32-41.mp3', 'qurantafseer/039-Az-Zumar 32-41.mp3', NULL, NULL, 39, 32, 41, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(878, '039-Az-Zumar 42-52.mp3', 'qurantafseer/039-Az-Zumar 42-52.mp3', NULL, NULL, 39, 42, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(879, '039-Az-Zumar 53-67.mp3', 'qurantafseer/039-Az-Zumar 53-67.mp3', NULL, NULL, 39, 53, 67, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(880, '039-Az-Zumar 68-75.mp3', 'qurantafseer/039-Az-Zumar 68-75.mp3', NULL, NULL, 39, 68, 75, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(881, '040-Al-Momin 01-9.mp3', 'qurantafseer/040-Al-Momin 01-9.mp3', NULL, NULL, 40, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(882, '040-Al-Momin 10-22.mp3', 'qurantafseer/040-Al-Momin 10-22.mp3', NULL, NULL, 40, 10, 22, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(883, '040-Al-Momin 23-46.mp3', 'qurantafseer/040-Al-Momin 23-46.mp3', NULL, NULL, 40, 23, 46, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(884, '040-Al-Momin 47-60.mp3', 'qurantafseer/040-Al-Momin 47-60.mp3', NULL, NULL, 40, 47, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(885, '040-Al-Momin 61-68.mp3', 'qurantafseer/040-Al-Momin 61-68.mp3', NULL, NULL, 40, 61, 68, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(886, '040-Al-Momin 69-85.mp3', 'qurantafseer/040-Al-Momin 69-85.mp3', NULL, NULL, 40, 69, 85, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(887, '041-Hamim As-Sajda 01-12.mp3', 'qurantafseer/041-Hamim As-Sajda 01-12.mp3', NULL, NULL, 41, 1, 12, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(888, '041-Hamim As-Sajda 13-25.mp3', 'qurantafseer/041-Hamim As-Sajda 13-25.mp3', NULL, NULL, 41, 13, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(889, '041-Hamim As-Sajda 26-36.mp3', 'qurantafseer/041-Hamim As-Sajda 26-36.mp3', NULL, NULL, 41, 26, 36, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(890, '041-Hamim As-Sajda 36-46.mp3', 'qurantafseer/041-Hamim As-Sajda 36-46.mp3', NULL, NULL, 41, 36, 46, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(891, '041-Hamim As-Sajda 47-54.mp3', 'qurantafseer/041-Hamim As-Sajda 47-54.mp3', NULL, NULL, 41, 47, 54, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(892, '042-Ash-Shoora 01-9.mp3', 'qurantafseer/042-Ash-Shoora 01-9.mp3', NULL, NULL, 42, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(893, '042-Ash-Shoora 10-19.mp3', 'qurantafseer/042-Ash-Shoora 10-19.mp3', NULL, NULL, 42, 10, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(894, '042-Ash-Shoora 20-29.mp3', 'qurantafseer/042-Ash-Shoora 20-29.mp3', NULL, NULL, 42, 20, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(895, '042-Ash-Shoora 30-43.mp3', 'qurantafseer/042-Ash-Shoora 30-43.mp3', NULL, NULL, 42, 30, 43, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(896, '042-Ash-Shoora 44-53.mp3', 'qurantafseer/042-Ash-Shoora 44-53.mp3', NULL, NULL, 42, 44, 53, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(897, '043-Az-Zukruf 01-15.mp3', 'qurantafseer/043-Az-Zukruf 01-15.mp3', NULL, NULL, 43, 1, 15, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(898, '043-Az-Zukruf 16-35.mp3', 'qurantafseer/043-Az-Zukruf 16-35.mp3', NULL, NULL, 43, 16, 35, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(899, '043-Az-Zukruf 36-56.mp3', 'qurantafseer/043-Az-Zukruf 36-56.mp3', NULL, NULL, 43, 36, 56, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(900, '043-Az-Zukruf 57-67.mp3', 'qurantafseer/043-Az-Zukruf 57-67.mp3', NULL, NULL, 43, 57, 67, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(901, '043-Az-Zukruf 68-89.mp3', 'qurantafseer/043-Az-Zukruf 68-89.mp3', NULL, NULL, 43, 68, 89, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(902, '044-Ad-Dukhan 01-29.mp3', 'qurantafseer/044-Ad-Dukhan 01-29.mp3', NULL, NULL, 44, 1, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(903, '044-Ad-Dukhan 30-59.mp3', 'qurantafseer/044-Ad-Dukhan 30-59.mp3', NULL, NULL, 44, 30, 59, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(904, '045-Al-Jasiya 01-11.mp3', 'qurantafseer/045-Al-Jasiya 01-11.mp3', NULL, NULL, 45, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(905, '045-Al-Jasiya 12-21.mp3', 'qurantafseer/045-Al-Jasiya 12-21.mp3', NULL, NULL, 45, 12, 21, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(906, '045-Al-Jathiya 22-37.mp3', 'qurantafseer/045-Al-Jathiya 22-37.mp3', NULL, NULL, 45, 22, 37, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(907, '046-Al-Ahqaf 01-10.mp3', 'qurantafseer/046-Al-Ahqaf 01-10.mp3', NULL, NULL, 46, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(908, '046-Al-Ahqaf 11-20.mp3', 'qurantafseer/046-Al-Ahqaf 11-20.mp3', NULL, NULL, 46, 11, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(909, '046-Al-Ahqaf 21-35.mp3', 'qurantafseer/046-Al-Ahqaf 21-35.mp3', NULL, NULL, 46, 21, 35, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(910, '047-Muhammad 01-11.mp3', 'qurantafseer/047-Muhammad 01-11.mp3', NULL, NULL, 47, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(911, '047-Muhammad 12-19.mp3', 'qurantafseer/047-Muhammad 12-19.mp3', NULL, NULL, 47, 12, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(912, '047-Muhammad 20-28.mp3', 'qurantafseer/047-Muhammad 20-28.mp3', NULL, NULL, 47, 20, 28, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(913, '047-Muhammad 29-38.mp3', 'qurantafseer/047-Muhammad 29-38.mp3', NULL, NULL, 47, 29, 38, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(914, '048-Al-Fath 01-7.mp3', 'qurantafseer/048-Al-Fath 01-7.mp3', NULL, NULL, 48, 1, 7, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(915, '048-Al-Fath 08-14.mp3', 'qurantafseer/048-Al-Fath 08-14.mp3', NULL, NULL, 48, 8, 14, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(916, '048-Al-Fath 15-17.mp3', 'qurantafseer/048-Al-Fath 15-17.mp3', NULL, NULL, 48, 15, 17, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(917, '048-Al-Fath 18-24.mp3', 'qurantafseer/048-Al-Fath 18-24.mp3', NULL, NULL, 48, 18, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(918, '048-Al-Fath 25-27.mp3', 'qurantafseer/048-Al-Fath 25-27.mp3', NULL, NULL, 48, 25, 27, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(919, '048-Al-Fath 28-29.mp3', 'qurantafseer/048-Al-Fath 28-29.mp3', NULL, NULL, 48, 28, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(920, '049-Al-Hujraat 01-6.mp3', 'qurantafseer/049-Al-Hujraat 01-6.mp3', NULL, NULL, 49, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(921, '049-Al-Hujraat 07-13.mp3', 'qurantafseer/049-Al-Hujraat 07-13.mp3', NULL, NULL, 49, 7, 13, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(922, '049-Al-Hujraat 14-18.mp3', 'qurantafseer/049-Al-Hujraat 14-18.mp3', NULL, NULL, 49, 14, 18, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(923, '050-Qaaf 01-15.mp3', 'qurantafseer/050-Qaaf 01-15.mp3', NULL, NULL, 50, 1, 15, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(924, '050-Qaaf 16-29.mp3', 'qurantafseer/050-Qaaf 16-29.mp3', NULL, NULL, 50, 16, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(925, '050-Qaaf 30-45.mp3', 'qurantafseer/050-Qaaf 30-45.mp3', NULL, NULL, 50, 30, 45, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(926, '051-Az-Zariayat 01-52.mp3', 'qurantafseer/051-Az-Zariayat 01-52.mp3', NULL, NULL, 51, 1, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(927, '051-Az-Zariayat 53-60.mp3', 'qurantafseer/051-Az-Zariayat 53-60.mp3', NULL, NULL, 51, 53, 60, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(928, '052-At-Tur 1-49.mp3', 'qurantafseer/052-At-Tur 1-49.mp3', NULL, NULL, 52, 1, 49, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(929, '053-An-Najm 01-16.mp3', 'qurantafseer/053-An-Najm 01-16.mp3', NULL, NULL, 53, 1, 16, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(930, '053-An-Najm 17-30.mp3', 'qurantafseer/053-An-Najm 17-30.mp3', NULL, NULL, 53, 17, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(931, '053-An-Najm 31-62.mp3', 'qurantafseer/053-An-Najm 31-62.mp3', NULL, NULL, 53, 31, 62, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(932, '054-Al-Qamar 01-8.mp3', 'qurantafseer/054-Al-Qamar 01-8.mp3', NULL, NULL, 54, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(933, '054-Al-Qamar 09-40.mp3', 'qurantafseer/054-Al-Qamar 09-40.mp3', NULL, NULL, 54, 9, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(934, '054-Al-Qamar 41-55.mp3', 'qurantafseer/054-Al-Qamar 41-55.mp3', NULL, NULL, 54, 41, 55, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(935, '055-Ar-Rahman 01-25.mp3', 'qurantafseer/055-Ar-Rahman 01-25.mp3', NULL, NULL, 55, 1, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(936, '055-Ar-Rahman 26-78.mp3', 'qurantafseer/055-Ar-Rahman 26-78.mp3', NULL, NULL, 55, 26, 78, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(937, '056-Al-Waqiyah 01-96.mp3', 'qurantafseer/056-Al-Waqiyah 01-96.mp3', NULL, NULL, 56, 1, 96, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(938, '057-Al-Hadeed 01-6.mp3', 'qurantafseer/057-Al-Hadeed 01-6.mp3', NULL, NULL, 57, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(939, '057-Al-Hadeed 07-10.mp3', 'qurantafseer/057-Al-Hadeed 07-10.mp3', NULL, NULL, 57, 7, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(940, '057-Al-Hadeed 11-19.mp3', 'qurantafseer/057-Al-Hadeed 11-19.mp3', NULL, NULL, 57, 11, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(941, '057-Al-Hadeed 16-25.mp3', 'qurantafseer/057-Al-Hadeed 16-25.mp3', NULL, NULL, 57, 16, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(942, '057-Al-Hadeed 26-29.mp3', 'qurantafseer/057-Al-Hadeed 26-29.mp3', NULL, NULL, 57, 26, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(943, '058-Al-Mujadila 1-22.mp3', 'qurantafseer/058-Al-Mujadila 1-22.mp3', NULL, NULL, 58, 1, 22, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(944, '059-Al-Hashar 01-10.mp3', 'qurantafseer/059-Al-Hashar 01-10.mp3', NULL, NULL, 59, 1, 10, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(945, '059-Al-Hashar 10-17.mp3', 'qurantafseer/059-Al-Hashar 10-17.mp3', NULL, NULL, 59, 10, 17, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(946, '059-Al-Hashar 18-24.mp3', 'qurantafseer/059-Al-Hashar 18-24.mp3', NULL, NULL, 59, 18, 24, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(947, '060-Al-Mumtahina 1-13.mp3', 'qurantafseer/060-Al-Mumtahina 1-13.mp3', NULL, NULL, 60, 1, 13, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(948, '061-As-Saff 01-9.mp3', 'qurantafseer/061-As-Saff 01-9.mp3', NULL, NULL, 61, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(949, '061-As-Saff 10-14.mp3', 'qurantafseer/061-As-Saff 10-14.mp3', NULL, NULL, 61, 10, 14, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(950, '062-Al-Juma\' 1-8.mp3', 'qurantafseer/062-Al-Juma\' 1-8.mp3', NULL, NULL, 62, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(951, '062-Al-Juma\' 9-11.mp3', 'qurantafseer/062-Al-Juma\' 9-11.mp3', NULL, NULL, 62, 9, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(952, '063-Al-Munafiqun 1-11.mp3', 'qurantafseer/063-Al-Munafiqun 1-11.mp3', NULL, NULL, 63, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(953, '064-At-Taghabun 1-8.mp3', 'qurantafseer/064-At-Taghabun 1-8.mp3', NULL, NULL, 64, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(954, '064-At-Taghabun 9-18.mp3', 'qurantafseer/064-At-Taghabun 9-18.mp3', NULL, NULL, 64, 9, 18, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(955, '065-At-Talaq 1-7.mp3', 'qurantafseer/065-At-Talaq 1-7.mp3', NULL, NULL, 65, 1, 7, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(956, '065-At-Talaq 8-12.mp3', 'qurantafseer/065-At-Talaq 8-12.mp3', NULL, NULL, 65, 8, 12, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(957, '066-At-Tahrim 1-8.mp3', 'qurantafseer/066-At-Tahrim 1-8.mp3', NULL, NULL, 66, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(958, '066-At-Tahrim 9-12.mp3', 'qurantafseer/066-At-Tahrim 9-12.mp3', NULL, NULL, 66, 9, 12, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(959, '067-Al-Mulk 1-30.mp3', 'qurantafseer/067-Al-Mulk 1-30.mp3', NULL, NULL, 67, 1, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(960, '068.Al-Qalam 1-52.mp3', 'qurantafseer/068.Al-Qalam 1-52.mp3', NULL, NULL, 68, 1, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(961, '069.Al-Haaqqa 1-52.mp3', 'qurantafseer/069.Al-Haaqqa 1-52.mp3', NULL, NULL, 69, 1, 52, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(962, '070.Al-Ma\'arij 1-44.mp3', 'qurantafseer/070.Al-Ma\'arij 1-44.mp3', NULL, NULL, 70, 1, 44, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(963, '071.Nuh 1-28.mp3', 'qurantafseer/071.Nuh 1-28.mp3', NULL, NULL, 71, 1, 28, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(964, '072.Al-Jinn 1-28.mp3', 'qurantafseer/072.Al-Jinn 1-28.mp3', NULL, NULL, 72, 1, 28, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(965, '073.Al-Muzammil 1-5.mp3', 'qurantafseer/073.Al-Muzammil 1-5.mp3', NULL, NULL, 73, 1, 5, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(966, '073.Al-Muzammil 6-20.mp3', 'qurantafseer/073.Al-Muzammil 6-20.mp3', NULL, NULL, 73, 6, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(967, '074.Al-Mudassir 1-31.mp3', 'qurantafseer/074.Al-Mudassir 1-31.mp3', NULL, NULL, 74, 1, 31, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(968, '074.Al-Mudassir 32-56.mp3', 'qurantafseer/074.Al-Mudassir 32-56.mp3', NULL, NULL, 74, 32, 56, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(969, '075.Al-Qayammah 1-40.mp3', 'qurantafseer/075.Al-Qayammah 1-40.mp3', NULL, NULL, 75, 1, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(970, '076.Ad-Dahar 1-31.mp3', 'qurantafseer/076.Ad-Dahar 1-31.mp3', NULL, NULL, 76, 1, 31, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(971, '077.Al-Mursalaat 1- 50.mp3', 'qurantafseer/077.Al-Mursalaat 1- 50.mp3', NULL, NULL, 77, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(972, '078.An Nabaa 1-40.mp3', 'qurantafseer/078.An Nabaa 1-40.mp3', NULL, NULL, 78, 1, 40, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(973, '079.Al Naziyat 1-46.mp3', 'qurantafseer/079.Al Naziyat 1-46.mp3', NULL, NULL, 79, 1, 46, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(974, '080.Abasa 1-42.mp3', 'qurantafseer/080.Abasa 1-42.mp3', NULL, NULL, 80, 1, 42, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(975, '081.Al Takwir 1-29.mp3', 'qurantafseer/081.Al Takwir 1-29.mp3', NULL, NULL, 81, 1, 29, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(976, '082.Al Infitar 1-19.mp3', 'qurantafseer/082.Al Infitar 1-19.mp3', NULL, NULL, 82, 1, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(977, '083.Al Mutaffifin 1-36 .mp3', 'qurantafseer/083.Al Mutaffifin 1-36 .mp3', NULL, NULL, 83, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(978, '084.Al - Insheqaq 1-25.mp3', 'qurantafseer/084.Al - Insheqaq 1-25.mp3', NULL, NULL, 84, 1, 25, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(979, '085.Al Buruj 1-22.mp3', 'qurantafseer/085.Al Buruj 1-22.mp3', NULL, NULL, 85, 1, 22, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(980, '086.Al Tariq 1-17.mp3', 'qurantafseer/086.Al Tariq 1-17.mp3', NULL, NULL, 86, 1, 17, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(981, '087.Al Aala 1-19.mp3', 'qurantafseer/087.Al Aala 1-19.mp3', NULL, NULL, 87, 1, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(982, '088.Al Ghashiya 1-26.mp3', 'qurantafseer/088.Al Ghashiya 1-26.mp3', NULL, NULL, 88, 1, 26, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(983, '089.Al Fajr 1-30.mp3', 'qurantafseer/089.Al Fajr 1-30.mp3', NULL, NULL, 89, 1, 30, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(984, '090.Al Balad 1-20.mp3', 'qurantafseer/090.Al Balad 1-20.mp3', NULL, NULL, 90, 1, 20, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(985, '091.AL Shams 1-15.mp3', 'qurantafseer/091.AL Shams 1-15.mp3', NULL, NULL, 91, 1, 15, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(986, '092.Al Lail 1-21 .mp3', 'qurantafseer/092.Al Lail 1-21 .mp3', NULL, NULL, 92, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(987, '093.Az Zuha 1-11.mp3', 'qurantafseer/093.Az Zuha 1-11.mp3', NULL, NULL, 93, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(988, '094.Alam Nashrah 1-8.mp3', 'qurantafseer/094.Alam Nashrah 1-8.mp3', NULL, NULL, 94, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(989, '095.At Teen 1-8.mp3', 'qurantafseer/095.At Teen 1-8.mp3', NULL, NULL, 95, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(990, '096.Al Alaq 1-19.mp3', 'qurantafseer/096.Al Alaq 1-19.mp3', NULL, NULL, 96, 1, 19, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(991, '097.Al  Qadar 1-5.mp3', 'qurantafseer/097.Al  Qadar 1-5.mp3', NULL, NULL, 97, 1, 5, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(992, '098.Al Bayyina 1-8.mp3', 'qurantafseer/098.Al Bayyina 1-8.mp3', NULL, NULL, 98, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(993, '099.Al Zilzal 1-8.mp3', 'qurantafseer/099.Al Zilzal 1-8.mp3', NULL, NULL, 99, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(994, '100.Al  Adiyat 1-11.mp3', 'qurantafseer/100.Al  Adiyat 1-11.mp3', NULL, NULL, 100, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(995, '101.Al Qariyah 1-11.mp3', 'qurantafseer/101.Al Qariyah 1-11.mp3', NULL, NULL, 101, 1, 11, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(996, '102.At Takasur 1-8.mp3', 'qurantafseer/102.At Takasur 1-8.mp3', NULL, NULL, 102, 1, 8, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(997, '103.Al Asar 1-3 .mp3', 'qurantafseer/103.Al Asar 1-3 .mp3', NULL, NULL, 103, NULL, NULL, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(998, '104.Al Humaza 1-9.mp3', 'qurantafseer/104.Al Humaza 1-9.mp3', NULL, NULL, 104, 1, 9, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(999, '105.Al  Feel 1-5   106.Quraish 1-4.mp3', 'qurantafseer/105.Al  Feel 1-5   106.Quraish 1-4.mp3', NULL, NULL, 105, 1, 4, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1000, '107.Al Maun 1-7.mp3', 'qurantafseer/107.Al Maun 1-7.mp3', NULL, NULL, 107, 1, 7, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1001, '108.Al Kauser 1-3.mp3', 'qurantafseer/108.Al Kauser 1-3.mp3', NULL, NULL, 108, 1, 3, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1002, '109.Al Kaferun 1-6.mp3', 'qurantafseer/109.Al Kaferun 1-6.mp3', NULL, NULL, 109, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1003, '110.An Nasar 1-3.mp3', 'qurantafseer/110.An Nasar 1-3.mp3', NULL, NULL, 110, 1, 3, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1004, '111.Al Lahab 1-5.mp3', 'qurantafseer/111.Al Lahab 1-5.mp3', NULL, NULL, 111, 1, 5, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1005, '112.Al Iklhas 1-4.mp3', 'qurantafseer/112.Al Iklhas 1-4.mp3', NULL, NULL, 112, 1, 4, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05'),
(1006, '113.Al Falaq 1-5   114.An - Nas 1-6.mp3', 'qurantafseer/113.Al Falaq 1-5   114.An - Nas 1-6.mp3', NULL, NULL, 113, 1, 6, NULL, 'ar', NULL, 1, '2026-01-05 15:50:05', '2026-01-05 15:50:05');

-- --------------------------------------------------------

--
-- Table structure for table `reciters`
--

CREATE TABLE `reciters` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `bio` text DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int(11) NOT NULL,
  `name` enum('Free','Monthly','Yearly') NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_days` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `name`, `price`, `duration_days`, `created_at`) VALUES
(1, 'Free', 0.00, NULL, '2026-01-06 15:29:19'),
(2, 'Monthly', 99.00, 30, '2026-01-06 15:29:19'),
(3, 'Yearly', 999.00, 365, '2026-01-06 15:29:19');

-- --------------------------------------------------------

--
-- Table structure for table `surahs`
--

CREATE TABLE `surahs` (
  `id` int(11) NOT NULL,
  `arabic_name` varchar(100) DEFAULT NULL,
  `english_name` varchar(100) DEFAULT NULL,
  `ayah_count` int(11) DEFAULT NULL,
  `revelation_type` enum('Meccan','Medinan') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_role` enum('user','admin') DEFAULT 'user',
  `is_premium` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_name` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `user_role`, `is_premium`, `created_at`, `updated_at`, `user_name`, `phone`) VALUES
(1, 'moinuxdesignerr@gmail.com', '$2y$10$eM9B6ou3oGbAETNgq7IsRu4rMpwQ9DAfaEMH4zIcpGJMJ3osDPAae', 'user', 0, '2026-01-07 15:43:06', '2026-01-07 15:43:06', 'KHAJA MYNUDDIN', '8121990714'),
(2, 'nasreen1057@gmail.com', '$2y$10$iHAKTmUGN3I.3NY4j4ZkBOKDg9DXS5rRXTYq14BrwLYQgMAe6YDL2', 'user', 0, '2026-01-07 15:51:05', '2026-01-07 15:51:05', 'SYED NASREEN FATHIMA', '9390797705');

-- --------------------------------------------------------

--
-- Table structure for table `user_subscriptions`
--

CREATE TABLE `user_subscriptions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audio_files`
--
ALTER TABLE `audio_files`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ayah_id` (`ayah_id`,`reciter_id`),
  ADD KEY `idx_audio_surah` (`surah_id`),
  ADD KEY `idx_audio_reciter` (`reciter_id`);

--
-- Indexes for table `ayahs`
--
ALTER TABLE `ayahs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `surah_id` (`surah_id`,`ayah_number`),
  ADD KEY `idx_ayah_surah` (`surah_id`);

--
-- Indexes for table `downloads`
--
ALTER TABLE `downloads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`audio_file_id`),
  ADD KEY `audio_file_id` (`audio_file_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `playlist_items`
--
ALTER TABLE `playlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `playlist_id` (`playlist_id`),
  ADD KEY `ayah_id` (`ayah_id`);

--
-- Indexes for table `quran_audio`
--
ALTER TABLE `quran_audio`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reciters`
--
ALTER TABLE `reciters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `surahs`
--
ALTER TABLE `surahs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `idx_subscription_user` (`user_id`,`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audio_files`
--
ALTER TABLE `audio_files`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ayahs`
--
ALTER TABLE `ayahs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `downloads`
--
ALTER TABLE `downloads`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlist_items`
--
ALTER TABLE `playlist_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quran_audio`
--
ALTER TABLE `quran_audio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1007;

--
-- AUTO_INCREMENT for table `reciters`
--
ALTER TABLE `reciters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audio_files`
--
ALTER TABLE `audio_files`
  ADD CONSTRAINT `audio_files_ibfk_1` FOREIGN KEY (`surah_id`) REFERENCES `surahs` (`id`),
  ADD CONSTRAINT `audio_files_ibfk_2` FOREIGN KEY (`ayah_id`) REFERENCES `ayahs` (`id`),
  ADD CONSTRAINT `audio_files_ibfk_3` FOREIGN KEY (`reciter_id`) REFERENCES `reciters` (`id`);

--
-- Constraints for table `ayahs`
--
ALTER TABLE `ayahs`
  ADD CONSTRAINT `ayahs_ibfk_1` FOREIGN KEY (`surah_id`) REFERENCES `surahs` (`id`);

--
-- Constraints for table `downloads`
--
ALTER TABLE `downloads`
  ADD CONSTRAINT `downloads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `downloads_ibfk_2` FOREIGN KEY (`audio_file_id`) REFERENCES `audio_files` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`);

--
-- Constraints for table `playlists`
--
ALTER TABLE `playlists`
  ADD CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `playlist_items`
--
ALTER TABLE `playlist_items`
  ADD CONSTRAINT `playlist_items_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`),
  ADD CONSTRAINT `playlist_items_ibfk_2` FOREIGN KEY (`ayah_id`) REFERENCES `ayahs` (`id`);

--
-- Constraints for table `user_subscriptions`
--
ALTER TABLE `user_subscriptions`
  ADD CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
