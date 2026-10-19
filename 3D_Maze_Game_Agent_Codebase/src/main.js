import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x202030)

/**
 * Maze Definiton (2D grid)
 * 0 = empty, 1 = wall, "S" = start, "G" = goal
 */

const MAZES = {
  small: [
  [1 ,  1 , 1 , 1 ,  1 , 1 , 1],
  [1 , 'S', 0 , 0 ,  1 , 0 , 1],
  [1 ,  0 , 1 , 0 ,  1 , 0 , 1],
  [1 ,  0 , 1 , 0 ,  0 , 0 , 1],
  [1 ,  0 , 1 , 1 ,  1 , 0 , 1],
  [1 ,  0 , 0 , 0 , 'G', 0 , 1],
  [1 ,  1 , 1 , 1 ,  1 , 1 , 1],
],
  medium: [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 'S', 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 'G', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
],
  large: [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 'S', 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'G', 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
],
  xlarge: [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 'S', 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'G', 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
],
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[j]
    array[j] = tmp
  }
  return array
}

// Generate a perfect maze on a (2*cellRow + 1) x (2*cellRow + 1) grid
function generatePerfectMazeGrid(cellRows, cellCols) {
  const mazeRows = cellRows * 2 + 1
  const mazeCols = cellCols * 2 + 1

  // Starting with the walls
  const grid = []
  for (let r = 0; r < mazeRows; r++) {
    grid[r] = new Array(mazeCols).fill(1)
  }

  const visited = []
  for (let r = 0; r < cellRows; r++) {
    visited[r] = new Array(cellCols).fill(false)
  }

  function carve(cr, cc) {
    visited[cr][cc] = true 
    const gr = cr * 2 + 1
    const gc = cc * 2 + 1
    grid[gr][gc] = 0

    const dirs = shuffleArray([
      { dr: -1, dc: 0},
      { dr: 1, dc: 0},
      { dr: 0, dc: -1},
      { dr: 0, dc: 1},
    ])

    for (const { dr, dc } of dirs) {
      const nr = cr + dr
      const nc = cc + dc

      if (nr < 0 || nr >= cellRows || nc < 0 || nc >= cellCols) {
        continue
      }
      if (visited[nr][nc]) continue

      // Open wall between current cell and neighbor
      const wr = gr + dr
      const wc = gc + dc
      grid[wr][wc] = 0

      carve(nr, nc)
    }
  }

  carve(0, 0) // start in top-left cell

  // Placec start and goal
  grid[1][1] = 'S'
  grid[mazeRows - 2][mazeCols - 2] = 'G'

  return grid
}

// Random maze in ~[7x7 , 29x29]
function createRandomMazeGrid() {
  const minCells = 3 // 2*3 + 1 = 7
  const maxCells = 14 // 2*14 + 1 = 29
  const cells = Math.floor(Math.random() * (maxCells - minCells + 1)) + minCells
  return generatePerfectMazeGrid(cells, cells)
}



// which maze is currently active
let currentMazeId = 'medium'
let maze = MAZES[currentMazeId]
// initQTable()

const cellSize = 1
const wallHeight = 1

function cellToWorld(row, col) {
  const rows = maze.length
  const cols = maze[0].length

  const x = (col - cols / 2 + 0.5) * cellSize
  const z = (row - rows / 2 + 0.5) * cellSize

  return { x, z }
}

/**
 * RL environment state (grid coordinates)
 */
let agentRow = 0
let agentCol = 0

const ACTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
}

/**
 * Q-Learning parameters
 */
let rows = maze.length
let cols = maze[0].length
const numActions = Object.keys(ACTIONS).length

// Q[row][col][actions] initialized to 0
let Q = []

function initQTable() {
  rows = maze.length
  cols = maze[0].length

  Q = []
  for (let r = 0; r < rows; r++) {
    Q[r] = []
    for (let c = 0; c < cols; c++) {
      Q[r][c] = new Array(numActions).fill(0)
  }
}
}

initQTable()

function switchMaze(newMazeId) {
  if (!MAZES[newMazeId]) {
    console.warn('Unknown maze id:', newMazeId)
    return
  }
  
  currentMazeId = newMazeId
  maze = MAZES[currentMazeId]

  // reset RL state
  epsilon = 1.0
  episodeCounter = 0

  applyDifficultySettings(DIFFICULTIES[currentDifficultyId])
  initQTable()
  buildmaze()
  resetEnv()
  updateHud({ steps: 0, totalReward: 0})
  setCameraPreset(currentCameraPreset)
}

function generateRandomMaze() {
  const grid = createRandomMazeGrid()
  MAZES.generated = grid

  if (mazeSelect) {
    mazeSelect.value = 'generated'
  }

  switchMaze('generated')
}

// Hyperparameters
let epsilon = 1.0       // exploration rate
const epsilonMin = 0.05
const epsilonDecay = 0.995

const alpha = 0.1      // learning rate
const gamma = 0.95     // discount factor

// Reward parameters
let rewardStep = -0.01
let rewardWallExtra = -0.09
let rewardGoal = 1.0

// sleep + flag
let isLiveTraining = false

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    mazeId: 'small',
    rewardStep: -0.005,
    rewardWallExtra: -0.045,
    rewardGoal: 1.0,
  },
  medium: {
    label: 'Medium',
    mazeId: 'medium',
    rewardStep: -0.01,
    rewardWallExtra: -0.09,
    rewardGoal: 1.0,
  },
  hard: {
    label: 'Hard',
    mazeId: 'large',
    rewardStep: -0.015,
    rewardWallExtra: -0.12,
    rewardGoal: 1.0,
  },
  veryHard: {
    label: 'Very Hard',
    mazeId: 'large',
    rewardStep: -0.02,
    rewardWallExtra: -0.18,
    rewardGoal: 1.0,
  },
}

let currentDifficultyId = 'medium'

function applyDifficultySettings(diff) {
  rewardStep = diff.rewardStep
  rewardWallExtra = diff.rewardWallExtra
  rewardGoal = diff.rewardGoal
}

function switchDifficulty(newDifficultyId) {
  const diff = DIFFICULTIES[newDifficultyId]
  if (!diff) {
    console.warn('Unknown difficulty id:', newDifficultyId)
    return
  }

  currentDifficultyId = newDifficultyId
  applyDifficultySettings(diff)

  // Switch maze and reset RL state
  switchMaze(diff.mazeId)
}
/**
 * DOM elements
 */
const hudEpisodeEl = document.querySelector('#hud-episode')
const hudStepsEl = document.querySelector('#hud-steps')
const hudRewardEl = document.querySelector('#hud-totalReward')
const hudEpsilonEl = document.querySelector('#hud-epsilon')
const hudRoot = document.querySelector('.hud')
const introOverlay = document.querySelector('#intro-overlay')
const btnIntroStart = document.querySelector('#btn-intro-start')

let isIntroVisible = true
let isHudHidden = false

function hideIntroOverlay() {
  if (!introOverlay) return
  isIntroVisible = false
  introOverlay.classList.add('intro-hidden')
}

function toggleHud() {
  if (!hudRoot) return
  isHudHidden = !isHudHidden
  hudRoot.classList.toggle('hud-hidden', isHudHidden)
}

function updateHud({ steps = 0, totalReward = 0 } = {}) {
  if (hudEpisodeEl) hudEpisodeEl.textContent = String(episodeCounter)
  if (hudStepsEl) hudStepsEl.textContent = String(steps)
  if (hudRewardEl) hudRewardEl.textContent = totalReward.toFixed(3)
  if (hudEpsilonEl) hudEpsilonEl.textContent = epsilon.toFixed(3)
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,                                       // fov
  window.innerWidth / window.innerHeight,   // aspect
  0.1,                                      // near 
  1000                                      // far
);
camera.position.set(0, 12, 8)
camera.lookAt(0, 0, 0)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

let currentCameraPreset = 2
let isFollowCamera = false

const followOffset = new THREE.Vector3()
const followDesiredPos = new THREE.Vector3()
const followLookTarget = new THREE.Vector3()

function autoFitDistance() {
  const longest = Math.max(rows, cols)
  return Math.max(longest * 0.9, 8)
}

function setCameraPreset(preset) {
  isFollowCamera = false
  controls.enabled = true
  currentCameraPreset = preset
  
  const d = autoFitDistance()

  if (preset === 1) {
    camera.position.set(0, d * 1.3, 0)
  } else if (preset === 2) {
    camera.position.set(d, d * 1.1, d)
  } else if (preset === 3) {
    camera.position.set(0, d * 0.9, d * 1.1)
  }

  camera.lookAt(0, 0, 0)
  controls.target.set(0, 0, 0)
  controls.update()
}

function setFollowCamera() {
  isFollowCamera = true
  controls.enabled = false

  if (agentMesh) {
    const d = autoFitDistance()
    // Diagonal, behind & above - scaled with maze size
    followOffset.set(d * 0.45, d * 0.8, d * 0.45)

    const target = agentMesh.position
    followDesiredPos.copy(target).add(followOffset)
    camera.position.copy(target).add(followOffset)
    camera.lookAt(target)
  }
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)

dirLight.position.set(3, 5, 2)
scene.add(dirLight)

/**
 * Maze Mesh
 */
let agentMesh
let startCell = null
let goalCell = null
let goalMesh
let mazeObjects = []

function clearMazeMeshes() {
  for (const obj of mazeObjects) {
    scene.remove(obj)
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose())
      } else {
        obj.material.dispose()
      }
    }
  }
  mazeObjects = []
  agentMesh = null
  startCell = null
  goalCell = null
  goalMesh = null
}

function buildmaze() {
  clearMazeMeshes()

  const rows = maze.length
  const cols = maze[0].length

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(cols * cellSize, rows * cellSize)
  const floorMaterial = new THREE.MeshStandardMaterial({color: 0x111133})
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = - Math.PI / 2
  floor.position.y = 0
  scene.add(floor)
  mazeObjects.push(floor)

  const wallGeometry = new THREE.BoxGeometry(cellSize, wallHeight, cellSize)
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x4444aa })

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = maze[row][col]

      const x = (col - cols / 2 + 0.5) * cellSize
      const z = (row - rows / 2 + 0.5) * cellSize

      if (cell === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial)
        wall.position.set(x, wallHeight / 2, z);
        scene.add(wall)
        mazeObjects.push(wall)
      }

      if (cell === 'S') {
        startCell = { row, col, x, z}
      }

      if  (cell === 'G') {
        goalCell = { row, col, x, z}
      }
    }
  }
  // Goal Marker
  if (goalCell) {
    const goalGeometry = new THREE.CylinderGeometry(
      0.35 * cellSize, // radiusTop
      0.35 * cellSize, // radiusBottom
      0.15 * cellSize, // height
      24               // segments 
    )

    const goalMaterial = new THREE.MeshStandardMaterial(
      {
        color: 0xffd700,
        emissive: 0x553300,
        emissiveIntensity: 5,
        metalness: 0.8,
        roughness: 0.3
      })

    goalMesh = new THREE.Mesh(goalGeometry, goalMaterial)
    const pointLight = new THREE.PointLight(0xffd700, 2.5)
    pointLight.position.set(goalCell.x, 0.08 * cellSize, goalCell.z)
    goalMesh.position.set(goalCell.x, 0.08 * cellSize, goalCell.z)
    scene.add(pointLight)
    scene.add(goalMesh)
    mazeObjects.push(pointLight, goalMesh)
  }
  // Cube Agent at start position
  const agentGeometry = new THREE.BoxGeometry(0.6 * cellSize, 0.6 * cellSize, 0.6 * cellSize)
  const agentMaterial = new THREE.MeshStandardMaterial({
    color: 0xff5555,
    emissive: 0x390a04,
    emissiveIntensity: 10,
    metalness: 0.8,
    roughness: 0.3

  })
  agentMesh = new THREE.Mesh(agentGeometry, agentMaterial)

  if (startCell) {
    agentMesh.position.set(startCell.x, 0.3 * cellSize, startCell.z)
  }
  
  scene.add(agentMesh)
  mazeObjects.push(agentMesh)
}

function findStartCell() {
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      if (maze[r][c] === 'S') {
        return { row: r, col: c}
      }
    }
  }
  return null
}

function isWall(row, col) {
  if (row < 0 || row >= maze.length) return true
  if (col < 0 || col >= maze[0].length) return true
  return maze[row][col] === 1
}

function isGoal(row, col) {
  return maze[row][col] === 'G'
}

function resetEnv() {
  const start = findStartCell()
  agentRow = start.row
  agentCol = start.col

  const { x, z } = cellToWorld(agentRow, agentCol) 
  agentMesh.position.set(x, 0.3 * cellSize, z)

  return { row: agentRow, col: agentCol }
}

/**
 * Returns (state, reward, done)
 */
function stepEnv(action) {
  let newRow = agentRow
  let newCol = agentCol

  if (action === ACTIONS.UP) newRow -= 1
  if (action === ACTIONS.DOWN) newRow += 1
  if (action === ACTIONS.LEFT) newCol -= 1
  if (action === ACTIONS.RIGHT) newCol += 1

  let reward = rewardStep
  let done = false

  // If hit wall or outside, stay in place and give extra penalty
  if (isWall(newRow, newCol)) {
    reward += rewardWallExtra  
  } else {
    agentRow = newRow
    agentCol = newCol
  }

  // Check goal
  if (isGoal(agentRow, agentCol)) {
    reward = rewardGoal
    done = true
  }

  const { x, z } = cellToWorld(agentRow, agentCol)
  agentMesh.position.set(x, 0.3 * cellSize, z)

  return {
    state: { row: agentRow, col: agentCol },
    reward,
    done,
  }
}

function randomAction() {
  const a = Math.floor(Math.random() * numActions)
  return a
}

function bestAction(row, col) {
  const qValues = Q[row][col]
  let bestA = 0
  let bestQ = qValues[0]
  
  for (let a = 1; a < numActions; a++) {
    if (qValues[a] > bestQ) {
      bestQ = qValues[a]
      bestA = a
    }
  }
  return bestA
}

function chooseAction(row, col) {
  if (Math.random() < epsilon) {
    return randomAction()         // explore
  } else {
    return bestAction(row, col)   // exploit
  }
}

function updateQ(prevRow, prevCol, action, reward, nextRow, nextCol) {
  const oldValue = Q[prevRow][prevCol][action]
  const nextBest = Math.max(...Q[nextRow][nextCol])

  const target = reward + gamma * nextBest
  const newValue = oldValue + alpha * (target - oldValue)

  Q[prevRow][prevCol][action] = newValue
}

let episodeCounter = 0

function decayEpsilon() {
  if (epsilon > epsilonMin) {
    epsilon *= epsilonDecay
    if (epsilon < epsilonMin) epsilon = epsilonMin
  }
}

// Runs a single episode and returns stats
function runEpisode(maxSteps = 200) {
  let state = resetEnv()
  let done = false
  let steps = 0
  let totalReward = 0

  while (!done && steps < maxSteps) {
    const action = chooseAction(state.row, state.col)

    const prevRow = state.row
    const prevCol = state.col
    
    const result = stepEnv(action)
    const nextState = result.state
    const reward = result.reward
    done = result.done

    updateQ(prevRow, prevCol, action, reward, nextState.row, nextState.col)

    state = nextState
    totalReward += reward
    steps += 1
  }

  episodeCounter += 1
  decayEpsilon()
  const stats = { steps, totalReward }
  updateHud(stats)
  
  return stats
}

function trainEpisodes(numEpisodes = 500) {
  for (let i = 0; i < numEpisodes; i++) {
    const { steps, totalReward } = runEpisode()
    if ((i+1) % 50 === 0) {
      console.log(
        `Episode ${episodeCounter} | steps=${steps} | totalReward=${totalReward.toFixed(3)} | epsilon=${epsilon.toFixed(3)}`
      )
    }
  }
  console.log('Training done. epsilon =', epsilon.toFixed(3))
}
window.trainEpisodes = trainEpisodes

async function liveTrain(numEpisodes = 50, stepDelayMs = 80, maxSteps = 200) {
  if (isLiveTraining) return
  isLiveTraining = true

  console.log(`Starting live training for ${numEpisodes} episodes`)

  for (let ep = 0; ep < numEpisodes; ep++) {
    let state = resetEnv()
    let done = false
    let steps = 0
    let totalReward = 0

    while (!done && steps < maxSteps && isLiveTraining) {
      const action = chooseAction(state.row, state.col)

      const prevRow = state.row
      const prevCol = state.col
      
      const result = stepEnv(action)
      const nextState = result.state
      const reward = result.reward
      done = result.done

      updateQ(prevRow, prevCol, action, reward, nextState.row, nextState.col)

      state = nextState
      totalReward += reward
      steps += 1

      // Live HUD update for current episode
      updateHud({ steps, totalReward })

      await sleep(stepDelayMs)
    }

    episodeCounter += 1
    decayEpsilon()
    updateHud({ steps, totalReward })

    if (!isLiveTraining) break
  }

  isLiveTraining = false
  console.log('Live training finished or stopped')
}

function runGreedyEpisodeVisual(delayMs = 150, maxSteps = 200) {
  let state = resetEnv()
  let steps = 0

  function stepOnce() {
    const action = bestAction(state.row, state.col) // exploit only
    const result = stepEnv(action)
    state = result.state
    steps += 1

    if (!result.done && steps < maxSteps) {
      setTimeout(stepOnce, delayMs)
    } else {
      console.log('Greedy episode finished. steps =', steps)
    }
  }

  stepOnce()
}
window.runGreedyEpisodeVisual = runGreedyEpisodeVisual

const btnTrain500 = document.querySelector('#btn-train-500')
const btnTrain2000 = document.querySelector('#btn-train-2000')
const btnLiveTrain = document.querySelector('#btn-live-train')
const btnPlayGreedy = document.querySelector('#btn-play-greedy')
const btnResetEnv = document.querySelector('#btn-reset-env')
const episodesInput = document.querySelector('#episodes-input')
const btnTrainCustom = document.querySelector('#btn-train-custom')
const mazeSelect = document.querySelector('#maze-select')
const btnMazeRandom = document.querySelector('#btn-maze-random')
const difficultySelect = document.querySelector('#difficulty-select')

if (btnTrain500) {
  btnTrain500.addEventListener('click', () => {
    if (isLiveTraining) return
    trainEpisodes(500)
  })
}

if (btnTrain2000) {
  btnTrain2000.addEventListener('click', () => {
    if (isLiveTraining) return
    trainEpisodes(2000)
  })
}

if (btnLiveTrain) {
  btnLiveTrain.addEventListener('click', () => {
    if (!isLiveTraining) {
      liveTrain(50, 80)  // 50 episodes, 80ms per step – tweak as you like
    }
  })
}

if (btnPlayGreedy) {
  btnPlayGreedy.addEventListener('click', () => {
    if (isLiveTraining) return
    runGreedyEpisodeVisual(150)
  })
}

if (btnResetEnv) {
  btnResetEnv.addEventListener('click', () => {
    resetEnv()
    updateHud({ steps: 0, totalReward: 0 })
  })
}

if (btnTrainCustom && episodesInput) {
  btnTrainCustom.addEventListener('click', () => {
    if (isLiveTraining) return

    const value = parseInt(episodesInput.value, 10)
    if (Number.isNaN(value) || value <= 0) {
      console.warn('Invalid episode count:', episodesInput.value)
      return
    }

    trainEpisodes(value)
  })

  // press Enter in the input to start training
  episodesInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      btnTrainCustom.click()
    }
  })
}

if (mazeSelect) {
  mazeSelect.addEventListener('change', (event) => {
    if (isLiveTraining) return
    const id = event.target.value
    if (id === 'generated') {
      generateRandomMaze()
    } else {
      switchMaze(id)
    }
  })
}

if (btnMazeRandom) {
  btnMazeRandom.addEventListener('click', () => {
    if (isLiveTraining) return
    generateRandomMaze()
  })
}

if (difficultySelect) {
  difficultySelect.addEventListener('change', (event) => {
    if (isLiveTraining) return
    const id = event.target.value
    switchDifficulty(id)
  })
}

if (btnIntroStart && introOverlay) {
  btnIntroStart.addEventListener('click', () => {
    hideIntroOverlay()
  })
}

buildmaze()
resetEnv()
setCameraPreset(2)



/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff88})
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

window.addEventListener('resize', () =>{
  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
});

window.addEventListener('keydown', (event) => {
  if (event.key === '1') {
    setCameraPreset(1)
    return
  }
  if (event.key === '2') {
    setCameraPreset(2)
    return
  }
  if (event.key === '3') {
    setCameraPreset(3)
    return
  }
  if (event.key === '4') {
    setFollowCamera()
    return
  }

  // If intro is visible, only listen for Enter / Space to close it
  if (isIntroVisible) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      hideIntroOverlay()
    }
    return
  }
  
  // H : toggle HUD visibility
  if (event.key === 'h' || event.key === 'H') {
    toggleHud()
    return
  }

  if (isLiveTraining) return 

  if (event.key === 'ArrowUp') stepEnv(ACTIONS.UP)
  if (event.key === 'ArrowDown') stepEnv(ACTIONS.DOWN)
  if (event.key === 'ArrowLeft') stepEnv(ACTIONS.LEFT)
  if (event.key === 'ArrowRight') stepEnv(ACTIONS.RIGHT)
})

// window.addEventListener('dblclick', (event) => {
//   // H : toggle HUD visibility for mobile phones, for testing purposes
//   if (event) {
//     toggleHud()
//     return
//   }
// })

function animate() {
  requestAnimationFrame(animate)

  if (isFollowCamera && agentMesh) {
    const d = autoFitDistance()
    // keep offset proportional if maze size changes
    followOffset.set(d * 0.45, d * 0.8, d * 0.45)

    followDesiredPos.copy(agentMesh.position).add(followOffset)
    // Smaller factor = smoother, more "weighty" camera
    camera.position.lerp(followDesiredPos, 1)

    followLookTarget.copy(agentMesh.position)
    camera.lookAt(followLookTarget)
  } else {
    controls.update()
  }

  renderer.render(scene, camera)
}

animate()




