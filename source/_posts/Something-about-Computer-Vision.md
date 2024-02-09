---
title: Something about Computer Vision
date: 2024-02-10 00:13:14
tags: CV, Python, Math
mathjax: true
---
This article is from the source PDF when I was participating the Shenzhen InnoX 2024 Winter Camp (High School) and learned the `Computer Vision` a little bit.

This is a minimal introduction to external & internal parameters, the transformation of axis, etc.

## Parameters

`Parameters` are transform matrixes, and they can help us to do a lot of things. The internal parameter is the camera matrix ($3\times 3$) and the distortion coefficient ($5\times 1$). The external parameter is a matrix which includes the rotation matrix ($3\times 3$) and the translation vector ($3\times 1$).

### Internal Parameters

The calibration of internal paramters can be done by a chessboard and the `cv2.calibrateCamera` function. The distortion coefficient can be used to correct the distortion of the image.

When calibrating, you need to capture different sides, distances, and angles of the chessboard. The more the better. On average, you need at least 10 pictures.

Then, you need to figure out the size of the chessboard and the width (squre) of each block. Then the computer can calculate each dot of the border of the chessboard.

#### Example

First, you need to convert the image to `gray`. Then you can use `findChessboardCorners` method to get corners.

```python
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
ret, corners = cv2.findChessboardCorners(gray, chessboard_size, None)
```

The object points can be calculated on hand:

```python
objp = np.zeros((np.prod(chessboard_size), 3), dtype=np.float32)
objp[:, :2] = np.indices(chessboard_size).T.reshape(-1, 2)
```

Then, you need to use `object_points` and `image_points` to calibrate the camera:

```python
(ret, camera_matrix, dist_coeffs, rvecs, tvecs) = cv2.calibrateCamera(
  object_points, image_points, size, None, None
)
```

Then, the `camera_matrix` and `dist_coeffs` can be used to correct the distortion of the image. You can save these data with `np.savez` method, because I did it so.

### External Parameters

After the calibration, you can use the `solvePnP` method to get the external parameters. The `solvePnP` method can be used to calculate the rotation matrix and the translation vector.

The external parameter is the transform matrix from the camera coordinate system to the vehicle coordinate system. It can be used to calculate the position of the vehicle.

$$
\left(
\begin{matrix}
  \boldsymbol{R} & \boldsymbol{t} \\
  \boldsymbol{0} & 1 \\
\end{matrix}
\right)
$$
