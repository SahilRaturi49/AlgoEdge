import { db } from "../libs/db.js";
export const createPlaylist = async (req, res) => {

    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        })
    } catch (error) {
        // console.error("Error creating playlist:", error);
        // res.status(500).json({ error: "Failed to create playlist" });
         if (error.code === 'P2002') {
        return res.status(400).json({
            success: false,
            error: "A playlist with this name already exists.",
        });
    }

    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
    }

}


export const getAllListDetails = async (req, res) => {

    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        Problem: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlists,
        });

    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: "Failed to fetch playlist" });
    }

}
export const getPlayListDetails = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const playlist = await db.playlist.findUnique({
            where: {
                playlistId,
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist,
        });

    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: "Failed to fetch playlist" });
    }

}
export const addProblemToPlaylist = async (req, res) => {

    const { playlistId } = req.params;
    const { problemIds } = req.body;

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemIds" });
        };

        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId: playlistId,
                problemId,
            })),
        });

        res.status(201).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlaylist,
        });
    } catch (error) {
        console.error("Error adding problems to playlist:", error.message);
        res.status(500).json({ error: "Failed to add problems to playlist" });
    }



}
export const deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;

    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            },
        });

        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletedPlaylist,
        });
    } catch (error) {
        console.error("Error deleting playlist:", error.message);
        res.status(500).json({ error: "Failed to delete playlist" });
    }

}
export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }
    // Only delete given problemIds not all

    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error.message);
    res.status(500).json({ error: "Failed to remove problem from playlist" });
  }

}