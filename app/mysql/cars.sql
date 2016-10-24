-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-10-2016 a las 17:16:21
-- Versión del servidor: 5.7.14
-- Versión de PHP: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cars`
--
CREATE DATABASE IF NOT EXISTS `cars` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `cars`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `car_color`
--

CREATE TABLE `car_color` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `car_color`
--

INSERT INTO `car_color` (`id`, `name`) VALUES
(1, 'black'),
(2, 'red'),
(3, 'white'),
(4, 'blue'),
(5, 'silver');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `car_maker`
--

CREATE TABLE `car_maker` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `car_maker`
--

INSERT INTO `car_maker` (`id`, `name`) VALUES
(1, 'ford'),
(2, 'toyota'),
(3, 'subaru');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `car_model`
--

CREATE TABLE `car_model` (
  `id` int(11) NOT NULL,
  `maker` int(11) DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `color` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `car_model`
--

INSERT INTO `car_model` (`id`, `maker`, `name`, `color`) VALUES
(1, 1, 'focus', 1),
(2, 1, 'fiesta', 2),
(3, 1, 'kuga', 3),
(4, 1, 'mondeo', 1),
(5, 2, 'rav4', 4),
(6, 2, 'cruiser', 1),
(7, 2, 'prius', 1),
(8, 2, 'yaris', 2),
(9, 3, 'xv', 4),
(10, 3, 'forester', 5),
(11, 3, 'outback', 1),
(12, 3, 'brz', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `car_table`
--

CREATE TABLE `car_table` (
  `name` varchar(8) CHARACTER SET utf8 DEFAULT NULL,
  `maker` varchar(6) CHARACTER SET utf8 DEFAULT NULL,
  `color` varchar(6) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `car_table`
--

INSERT INTO `car_table` (`name`, `maker`, `color`) VALUES
('focus', 'ford', 'black'),
('fiesta', 'ford', 'red'),
('kuga', 'ford', 'white'),
('mondeo', 'ford', 'black'),
('rav4', 'toyota', 'blue'),
('cruiser', 'toyota', 'black'),
('prius', 'toyota', 'black'),
('yaris', 'toyota', 'red'),
('xv', 'subaru', 'blue'),
('forester', 'subaru', 'silver'),
('outback', 'subaru', 'black'),
('brz', 'subaru', 'blue');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `car_color`
--
ALTER TABLE `car_color`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQUE` (`name`);

--
-- Indices de la tabla `car_maker`
--
ALTER TABLE `car_maker`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQUE` (`name`);

--
-- Indices de la tabla `car_model`
--
ALTER TABLE `car_model`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQUE` (`name`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `car_color`
--
ALTER TABLE `car_color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `car_maker`
--
ALTER TABLE `car_maker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `car_model`
--
ALTER TABLE `car_model`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
