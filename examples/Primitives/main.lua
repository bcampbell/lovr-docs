shader = require 'shader'

local function drawLabel(str, x, y, z)
  lovr.graphics.setColor(255, 255, 255)
  lovr.graphics.print(str, x, y, z, .1)
end

function lovr.draw()
  lovr.graphics.setBackgroundColor(30, 30, 30)
  lovr.graphics.setShader(shader)

  local hx, hy, hz = lovr.headset.getPosition()
  local x, y, z

  -- Point
  x, y, z = -.6, 1.1, -1
  lovr.graphics.setPointSize(5)
  lovr.graphics.setColor(255, 255, 255)
  lovr.graphics.points(x, y, z)

  -- Line
  x, y, z = 0, 1.1, -1
  local points = {
    x - .1, y, z,
    x + .1, y, z
  }
  lovr.graphics.setColor(255, 255, 255)
  lovr.graphics.line(points)

  -- Triangle
  local x, y, z = .6, 1.1, -1
  local p1 = { x, y + .2, z }
  local p2 = { x - .2, y - .2, z }
  local p3 = { x + .2, y - .2, z }
  lovr.graphics.setColor(92, 107, 192)
  lovr.graphics.triangle('fill', p1[1], p1[2], p1[3], p2[1], p2[2], p2[3], p3[1], p3[2], p3[3])

  -- Plane
  local x, y, z = -.6, 1.7, -1.5
  lovr.graphics.setColor(239, 83, 80)
  lovr.graphics.plane('fill', x, y, z, .4, lovr.timer.getTime())

  -- Cube
  local x, y, z = 0, 1.7, -1.5
  lovr.graphics.setColor(126, 87, 194)
  lovr.graphics.cube('fill', x, y, z, .3, lovr.timer.getTime())

  -- Box
  local x, y, z = .6, 1.7, -1.5
  lovr.graphics.setColor(255, 167, 45)
  lovr.graphics.box('fill', x, y, z, .4, .2, .3, lovr.timer.getTime())

  -- Cylinder
  local x, y, z = -.6, 2.4, -2
  lovr.graphics.setColor(102, 187, 106)
  lovr.graphics.cylinder(x - .2, y, z, x + .2, y, z, .1, .1)

  -- Cone
  local x, y, z = 0, 2.4, -2
  lovr.graphics.setColor(255, 241, 118)
  lovr.graphics.cylinder(x, y + .2, z, x, y - .2, z, 0, .18)

  -- Sphere
  local x, y, z = .6, 2.4, -2
  lovr.graphics.setColor(77, 208, 255)
  lovr.graphics.sphere(x, y, z, .2)

  lovr.graphics.setShader()
  drawLabel('Point', -.6, 1.4, -1)
  drawLabel('Line', 0, 1.4, -1)
  drawLabel('Triangle', .6, 1.4, -1)
  drawLabel('Plane', -.6, 2.0, -1.5)
  drawLabel('Cube', 0, 2.0, -1.5)
  drawLabel('Box', .6, 2.0, -1.5)
  drawLabel('Cylinder', -.6, 2.7, -2)
  drawLabel('Cone', 0, 2.7, -2)
  drawLabel('Sphere', .6, 2.7, -2)
end
