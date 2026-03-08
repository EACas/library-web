-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2026 at 04:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_ms`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_status`
--

CREATE TABLE `account_status` (
  `account_status_id` int(11) NOT NULL,
  `account_status` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `account_status`
--

INSERT INTO `account_status` (`account_status_id`, `account_status`) VALUES
(1, 'active'),
(2, 'inactive'),
(3, 'Suspended');

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `author_id` int(11) NOT NULL,
  `author_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`author_id`, `author_name`) VALUES
(1, 'J.K. Rowling'),
(2, 'George Orwell'),
(3, 'J.R.R. Tolkien'),
(4, 'Agatha Christie'),
(5, 'test'),
(6, 'test3');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `book_title` varchar(45) NOT NULL,
  `description` text NOT NULL,
  `publish_date` date DEFAULT NULL,
  `price` float NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `book_title`, `description`, `publish_date`, `price`, `stock`) VALUES
(1, 'Harry Potter and the Philosopher\'s Stone', 'Fantasy novel', '1997-06-26', 15.99, 10),
(2, '1984', 'Dystopian novel', '1949-06-08', 12.5, 7),
(3, 'The Hobbit', 'Fantasy adventure', '1937-09-21', 14.75, 5),
(4, 'Murder on the Orient Express', 'Detective novel', '1934-01-01', 11.2, 6),
(5, 'test', 'sdasd', '2026-03-02', 23, 1),
(6, 'test', 'asdadasdsqadas', '2026-03-02', 1, 2),
(8, 'test', 'qweqweqe', '2026-03-02', 132, 3);

-- --------------------------------------------------------

--
-- Table structure for table `book_actions_books`
--

CREATE TABLE `book_actions_books` (
  `book_action_books` int(11) NOT NULL,
  `user_book_actions__id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `book_condition_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_authors`
--

CREATE TABLE `book_authors` (
  `book_author_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `book_authors`
--

INSERT INTO `book_authors` (`book_author_id`, `book_id`, `author_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 4),
(6, 6, 1),
(8, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `book_conditions`
--

CREATE TABLE `book_conditions` (
  `book_condition_id` int(11) NOT NULL,
  `book_condition` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `book_conditions`
--

INSERT INTO `book_conditions` (`book_condition_id`, `book_condition`) VALUES
(1, 'New'),
(2, 'Good'),
(3, 'Used'),
(4, 'Damaged');

-- --------------------------------------------------------

--
-- Table structure for table `book_condition_library_rate`
--

CREATE TABLE `book_condition_library_rate` (
  `book_condition_rate_id` int(11) NOT NULL,
  `library_id` int(11) NOT NULL,
  `book_condition` int(11) NOT NULL,
  `cost` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_genres`
--

CREATE TABLE `book_genres` (
  `book_genre_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `book_genres`
--

INSERT INTO `book_genres` (`book_genre_id`, `book_id`, `genre_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 2, 3),
(4, 3, 1),
(5, 4, 4),
(6, 4, 5),
(7, 5, 5),
(8, 6, 5),
(9, 8, 5),
(10, 8, 2),
(11, 8, 4),
(12, 8, 3);

-- --------------------------------------------------------

--
-- Table structure for table `book_reservation_books`
--

CREATE TABLE `book_reservation_books` (
  `book_reservation_book_id` int(11) NOT NULL,
  `date_reserved` datetime NOT NULL,
  `user_book_reservations_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `days`
--

CREATE TABLE `days` (
  `day_id` int(11) NOT NULL,
  `day` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `days`
--

INSERT INTO `days` (`day_id`, `day`) VALUES
(1, 'Monday'),
(2, 'Tuesday'),
(3, 'Wednesday'),
(4, 'Thursday'),
(5, 'Friday'),
(6, 'Saturday'),
(7, 'Sunday');

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `district_id` int(11) NOT NULL,
  `district` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`district_id`, `district`) VALUES
(1, 'Corozal'),
(2, 'Orange Walk'),
(3, 'Belize'),
(4, 'Cayo'),
(5, 'Stann Creek'),
(6, 'Toledo');

-- --------------------------------------------------------

--
-- Table structure for table `district_villages`
--

CREATE TABLE `district_villages` (
  `district_village_id` int(11) NOT NULL,
  `district` int(11) NOT NULL,
  `village` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `district_villages`
--

INSERT INTO `district_villages` (`district_village_id`, `district`, `village`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `from_days`
--

CREATE TABLE `from_days` (
  `from_day_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `from_days`
--

INSERT INTO `from_days` (`from_day_id`, `day_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `genre_id` int(11) NOT NULL,
  `genre` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`genre_id`, `genre`) VALUES
(1, 'Fantasy'),
(2, 'Dystopian'),
(3, 'Science Fiction'),
(4, 'Mystery'),
(5, 'Detective');

-- --------------------------------------------------------

--
-- Table structure for table `librarians`
--

CREATE TABLE `librarians` (
  `librarian_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `salary` float NOT NULL,
  `began_at` datetime NOT NULL,
  `account_balance` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `library`
--

CREATE TABLE `library` (
  `library_id` int(11) NOT NULL,
  `library_name` varchar(75) NOT NULL,
  `district_village` int(11) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `allowed_borrowed_books` int(11) NOT NULL,
  `rate_day` float NOT NULL,
  `is_open` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `library`
--

INSERT INTO `library` (`library_id`, `library_name`, `district_village`, `phone`, `email`, `allowed_borrowed_books`, `rate_day`, `is_open`) VALUES
(1, 'Corozal Library', 1, '21234567', 'central@library.com', 5, 0.5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `opening_hours`
--

CREATE TABLE `opening_hours` (
  `opening_hour_id` int(11) NOT NULL,
  `library_id` int(11) NOT NULL,
  `from_day` int(11) NOT NULL,
  `to_day` int(11) NOT NULL,
  `start_hour` int(11) NOT NULL,
  `end_hour` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `opening_hours`
--

INSERT INTO `opening_hours` (`opening_hour_id`, `library_id`, `from_day`, `to_day`, `start_hour`, `end_hour`) VALUES
(1, 1, 1, 1, 8, 17);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role`) VALUES
(1, 'admin'),
(2, 'librarian'),
(3, 'student');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int(11) NOT NULL,
  `satus` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `satus`) VALUES
(1, 'Borrowed'),
(2, 'Returned'),
(3, 'Late'),
(4, 'Reserved');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_balance` float NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `to_day`
--

CREATE TABLE `to_day` (
  `to_day_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `to_day`
--

INSERT INTO `to_day` (`to_day_id`, `day_id`) VALUES
(1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_library_id` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `f_name` varchar(45) NOT NULL,
  `l_name` varchar(45) NOT NULL,
  `phone_number` varchar(45) NOT NULL,
  `gender` tinyint(4) NOT NULL,
  `password` text NOT NULL,
  `dob` datetime NOT NULL,
  `account_status` int(11) NOT NULL,
  `library_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `date_added` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_library_id`, `email`, `f_name`, `l_name`, `phone_number`, `gender`, `password`, `dob`, `account_status`, `library_id`, `role_id`, `date_added`) VALUES
(5, 'LIB69ac85c0dc536', 'admin@test.com', 'Luis', 'Mattu', '6264246', 1, '$2y$10$Wa9jZ6LEj4vyqgFx5/Ami.fU1K4RKLT3yk0y.J0A33ksffhpnq8SO', '2026-03-07 00:00:00', 1, 1, 1, '2026-03-07'),
(6, 'LIB69ac86168ea68', 'librarian@test.com', 'Esmiri', 'Castillo', '6264246', 2, '$2y$10$Okog5CfTlgq7NBIgAmBw/e/2/tGfhzeGAjLkd7v.2JJhOh4FzLR6K', '2026-03-07 00:00:00', 1, 1, 2, '2026-03-07'),
(7, 'LIB69ac864a2908d', 'student@test.com', 'Madelyn', 'Cunil', '6264246', 2, '$2y$10$YCD/S9iVC1rODbQMOHHUGes2PbVxtU00ssuOGhu6vO1nOHqF34mqC', '2026-03-07 00:00:00', 1, 1, 3, '2026-03-07'),
(9, 'LIB69acd9b7166dc', 'student2@gmail.com', 'Daniel', 'Villanueva', '6264246', 1, '$2y$10$KpIhaqZy8HOOpyrqJgAqw.BT9Xh5/KGMgIn2CTsXNkfToZcB0UhZO', '0000-00-00 00:00:00', 1, 1, 3, '2026-03-07');

-- --------------------------------------------------------

--
-- Table structure for table `user_book_actions`
--

CREATE TABLE `user_book_actions` (
  `user_book_action_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `borrowed_time` datetime DEFAULT NULL,
  `action` tinyint(4) NOT NULL,
  `due_date` datetime NOT NULL,
  `returned_time` datetime DEFAULT NULL,
  `net_cost` float NOT NULL,
  `total_coast` float DEFAULT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_book_reservations`
--

CREATE TABLE `user_book_reservations` (
  `user_book_reservations` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_cost` float NOT NULL,
  `reservation_status` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_district_village`
--

CREATE TABLE `user_district_village` (
  `user_district_village_id` int(11) NOT NULL,
  `district_village_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `villages`
--

CREATE TABLE `villages` (
  `village_id` int(11) NOT NULL,
  `village` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `villages`
--

INSERT INTO `villages` (`village_id`, `village`) VALUES
(1, 'Ranchito'),
(2, 'Santa Elena'),
(3, 'San Roman'),
(4, 'Punta Gorda');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_status`
--
ALTER TABLE `account_status`
  ADD PRIMARY KEY (`account_status_id`);

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`author_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`);

--
-- Indexes for table `book_actions_books`
--
ALTER TABLE `book_actions_books`
  ADD PRIMARY KEY (`book_action_books`),
  ADD KEY `fk_book_actions_books_user_book_actions1_idx` (`user_book_actions__id`),
  ADD KEY `fk_book_actions_books_books1_idx` (`book_id`),
  ADD KEY `fk_book_actions_books_book_conditions1_idx` (`book_condition_id`);

--
-- Indexes for table `book_authors`
--
ALTER TABLE `book_authors`
  ADD PRIMARY KEY (`book_author_id`),
  ADD KEY `fk_book_authors_books1_idx` (`book_id`),
  ADD KEY `fk_book_authors_authors1_idx` (`author_id`);

--
-- Indexes for table `book_conditions`
--
ALTER TABLE `book_conditions`
  ADD PRIMARY KEY (`book_condition_id`);

--
-- Indexes for table `book_condition_library_rate`
--
ALTER TABLE `book_condition_library_rate`
  ADD PRIMARY KEY (`book_condition_rate_id`),
  ADD KEY `fk_book_condition_rate_book_conditions1_idx` (`book_condition`),
  ADD KEY `fk_book_condition_library_rate_library1_idx` (`library_id`);

--
-- Indexes for table `book_genres`
--
ALTER TABLE `book_genres`
  ADD PRIMARY KEY (`book_genre_id`),
  ADD KEY `fk_book_genres_books1_idx` (`book_id`),
  ADD KEY `fk_book_genres_book_genres1_idx` (`genre_id`);

--
-- Indexes for table `book_reservation_books`
--
ALTER TABLE `book_reservation_books`
  ADD PRIMARY KEY (`book_reservation_book_id`),
  ADD KEY `fk_book_reservation_books_user_book_reservations1_idx` (`user_book_reservations_id`),
  ADD KEY `fk_book_reservation_books_books1_idx` (`book_id`);

--
-- Indexes for table `days`
--
ALTER TABLE `days`
  ADD PRIMARY KEY (`day_id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`district_id`);

--
-- Indexes for table `district_villages`
--
ALTER TABLE `district_villages`
  ADD PRIMARY KEY (`district_village_id`),
  ADD KEY `fk_district_villages_districts1_idx` (`district`),
  ADD KEY `fk_district_villages_villages1_idx` (`village`);

--
-- Indexes for table `from_days`
--
ALTER TABLE `from_days`
  ADD PRIMARY KEY (`from_day_id`),
  ADD KEY `fk_from_days1_idx` (`day_id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`genre_id`);

--
-- Indexes for table `librarians`
--
ALTER TABLE `librarians`
  ADD PRIMARY KEY (`librarian_id`),
  ADD KEY `fk_librarians_users1_idx` (`user_id`);

--
-- Indexes for table `library`
--
ALTER TABLE `library`
  ADD PRIMARY KEY (`library_id`),
  ADD KEY `fk_library_district_villages_idx` (`district_village`);

--
-- Indexes for table `opening_hours`
--
ALTER TABLE `opening_hours`
  ADD PRIMARY KEY (`opening_hour_id`),
  ADD KEY `fk_opening_hours_from_days1_idx` (`from_day`),
  ADD KEY `fk_opening_hours_to_day1_idx` (`to_day`),
  ADD KEY `fk_opening_hours_library1_idx` (`library_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `fk_students_users1_idx` (`user_id`);

--
-- Indexes for table `to_day`
--
ALTER TABLE `to_day`
  ADD PRIMARY KEY (`to_day_id`),
  ADD KEY `fk_to_days1_idx` (`day_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_users_account_status1_idx` (`account_status`),
  ADD KEY `fk_users_library1_idx` (`library_id`),
  ADD KEY `fk_users_roles1_idx` (`role_id`);

--
-- Indexes for table `user_book_actions`
--
ALTER TABLE `user_book_actions`
  ADD PRIMARY KEY (`user_book_action_id`),
  ADD KEY `fk_borrowed_books_users1_idx` (`user_id`),
  ADD KEY `fk_user_book_actions_status1_idx` (`status`);

--
-- Indexes for table `user_book_reservations`
--
ALTER TABLE `user_book_reservations`
  ADD PRIMARY KEY (`user_book_reservations`),
  ADD KEY `fk_user_book_reservations_users1_idx` (`user_id`);

--
-- Indexes for table `user_district_village`
--
ALTER TABLE `user_district_village`
  ADD PRIMARY KEY (`user_district_village_id`),
  ADD KEY `fk_student_district_village_district_villages1_idx` (`district_village_id`),
  ADD KEY `fk_user_district_village_users1_idx` (`user_id`);

--
-- Indexes for table `villages`
--
ALTER TABLE `villages`
  ADD PRIMARY KEY (`village_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_status`
--
ALTER TABLE `account_status`
  MODIFY `account_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `author_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `book_actions_books`
--
ALTER TABLE `book_actions_books`
  MODIFY `book_action_books` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_authors`
--
ALTER TABLE `book_authors`
  MODIFY `book_author_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `book_conditions`
--
ALTER TABLE `book_conditions`
  MODIFY `book_condition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `book_condition_library_rate`
--
ALTER TABLE `book_condition_library_rate`
  MODIFY `book_condition_rate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_genres`
--
ALTER TABLE `book_genres`
  MODIFY `book_genre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `book_reservation_books`
--
ALTER TABLE `book_reservation_books`
  MODIFY `book_reservation_book_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `days`
--
ALTER TABLE `days`
  MODIFY `day_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `district_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `district_villages`
--
ALTER TABLE `district_villages`
  MODIFY `district_village_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `from_days`
--
ALTER TABLE `from_days`
  MODIFY `from_day_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `genre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `librarians`
--
ALTER TABLE `librarians`
  MODIFY `librarian_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `library`
--
ALTER TABLE `library`
  MODIFY `library_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `opening_hours`
--
ALTER TABLE `opening_hours`
  MODIFY `opening_hour_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `to_day`
--
ALTER TABLE `to_day`
  MODIFY `to_day_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_book_actions`
--
ALTER TABLE `user_book_actions`
  MODIFY `user_book_action_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_book_reservations`
--
ALTER TABLE `user_book_reservations`
  MODIFY `user_book_reservations` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_district_village`
--
ALTER TABLE `user_district_village`
  MODIFY `user_district_village_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `villages`
--
ALTER TABLE `villages`
  MODIFY `village_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_actions_books`
--
ALTER TABLE `book_actions_books`
  ADD CONSTRAINT `fk_book_actions_books_book_conditions1` FOREIGN KEY (`book_condition_id`) REFERENCES `book_conditions` (`book_condition_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_book_actions_books_books1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_book_actions_books_user_book_actions1` FOREIGN KEY (`user_book_actions__id`) REFERENCES `user_book_actions` (`user_book_action_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `book_authors`
--
ALTER TABLE `book_authors`
  ADD CONSTRAINT `fk_book_authors_authors1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_book_authors_books1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `book_condition_library_rate`
--
ALTER TABLE `book_condition_library_rate`
  ADD CONSTRAINT `fk_book_condition_library_rate_library1` FOREIGN KEY (`library_id`) REFERENCES `library` (`library_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_book_condition_rate_book_conditions1` FOREIGN KEY (`book_condition`) REFERENCES `book_conditions` (`book_condition_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `book_genres`
--
ALTER TABLE `book_genres`
  ADD CONSTRAINT `fk_book_genres_book_genres1` FOREIGN KEY (`genre_id`) REFERENCES `book_genres` (`book_genre_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_book_genres_books1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `book_reservation_books`
--
ALTER TABLE `book_reservation_books`
  ADD CONSTRAINT `fk_book_reservation_books_books1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_book_reservation_books_user_book_reservations1` FOREIGN KEY (`user_book_reservations_id`) REFERENCES `user_book_reservations` (`user_book_reservations`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `district_villages`
--
ALTER TABLE `district_villages`
  ADD CONSTRAINT `fk_district_villages_districts1` FOREIGN KEY (`district`) REFERENCES `districts` (`district_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_district_villages_villages1` FOREIGN KEY (`village`) REFERENCES `villages` (`village_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `from_days`
--
ALTER TABLE `from_days`
  ADD CONSTRAINT `fk_from_days1` FOREIGN KEY (`day_id`) REFERENCES `days` (`day_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `librarians`
--
ALTER TABLE `librarians`
  ADD CONSTRAINT `fk_librarians_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `library`
--
ALTER TABLE `library`
  ADD CONSTRAINT `fk_library_district_villages` FOREIGN KEY (`district_village`) REFERENCES `district_villages` (`district_village_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `opening_hours`
--
ALTER TABLE `opening_hours`
  ADD CONSTRAINT `fk_opening_hours_from_days1` FOREIGN KEY (`from_day`) REFERENCES `from_days` (`from_day_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_opening_hours_library1` FOREIGN KEY (`library_id`) REFERENCES `library` (`library_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_opening_hours_to_day1` FOREIGN KEY (`to_day`) REFERENCES `to_day` (`to_day_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `to_day`
--
ALTER TABLE `to_day`
  ADD CONSTRAINT `fk_to_days1` FOREIGN KEY (`day_id`) REFERENCES `days` (`day_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_account_status1` FOREIGN KEY (`account_status`) REFERENCES `account_status` (`account_status_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_library1` FOREIGN KEY (`library_id`) REFERENCES `library` (`library_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_roles1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user_book_actions`
--
ALTER TABLE `user_book_actions`
  ADD CONSTRAINT `fk_borrowed_books_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_book_actions_status1` FOREIGN KEY (`status`) REFERENCES `status` (`status_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user_book_reservations`
--
ALTER TABLE `user_book_reservations`
  ADD CONSTRAINT `fk_user_book_reservations_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user_district_village`
--
ALTER TABLE `user_district_village`
  ADD CONSTRAINT `fk_student_district_village_district_villages1` FOREIGN KEY (`district_village_id`) REFERENCES `district_villages` (`district_village_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_district_village_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
