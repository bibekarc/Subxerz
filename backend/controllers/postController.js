import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img, video, pdf } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLength = 2200;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // Handle image uploads
    let imgUrls = [];
    if (img && Array.isArray(img)) {
      for (let i = 0; i < img.length; i++) {
        const uploadedResponse = await cloudinary.uploader.upload(img[i], {
          resource_type: "image",
        });
        imgUrls.push(uploadedResponse.secure_url);
      }
    } else if (img) {
      // Handle single image upload
      const uploadedResponse = await cloudinary.uploader.upload(img, {
        resource_type: "image",
      });
      imgUrls.push(uploadedResponse.secure_url);
    }

    // Handle video upload (unchanged)
    let videoUrl = video;
    if (video) {
      const uploadedResponse = await cloudinary.uploader.upload(video, {
        resource_type: "video",
      });
      videoUrl = uploadedResponse.secure_url;
    }

    // Handle PDF upload (unchanged)
    let pdfUrl = pdf;
    if (pdf) {
      const uploadedResponse = await cloudinary.uploader.upload(pdf, {
        resource_type: "raw", // Use "raw" for PDFs
      });
      pdfUrl = uploadedResponse.secure_url;
    }

    // Create the post with img (array of image URLs), video, and/or pdf
    const newPost = new Post({
      postedBy,
      text,
      img: imgUrls, // Set img to the array of image URLs
      video: videoUrl,
      pdf: pdfUrl,
    });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};


const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      console.error("Post not found with ID:", req.params.id);
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is authorized to delete the post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      console.error("Unauthorized: User is not the post owner");
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    // Delete associated media files (multiple images, video, pdf) if they exist

    // If img is an array (multiple images)
    if (Array.isArray(post.img)) {
      console.log("Deleting multiple images");
      for (const imgUrl of post.img) {
        const imgId = imgUrl.split("/").pop().split(".")[0];
        console.log("Deleting image with ID:", imgId);
        await cloudinary.uploader.destroy(imgId);
      }
    } else if (post.img) {  // For single image (if still used)
      const imgId = post.img.split("/").pop().split(".")[0];
      console.log("Deleting single image with ID:", imgId);
      await cloudinary.uploader.destroy(imgId);
    }

    // Delete video if it exists
    if (post.video) {
      const videoId = post.video.split("/").pop().split(".")[0];
      console.log("Deleting video with ID:", videoId);
      await cloudinary.uploader.destroy(videoId, { resource_type: "video" });
    }

    // Delete PDF if it exists
    if (post.pdf) {
      const pdfId = post.pdf.split("/").pop().split(".")[0];
      console.log("Deleting PDF with ID:", pdfId);
      await cloudinary.uploader.destroy(pdfId);
    }

    // Delete the post itself
    await post.deleteOne();
    console.log("Post deleted successfully with ID:", req.params.id);

    return res.status(200).json({ message: "Post deleted successfully" });

  } catch (err) {
    console.error("Error deleting post:", err.message);
    return res.status(500).json({ error: "Server error while deleting post" });
  }
};


const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
  try {
    // Assuming the user's ID is available in req.user.id from authentication middleware
    const userId = req.user._id;

    // Fetch all posts from the Post collection, excluding the current user's posts
    const feedPosts = await Post.find({ createdBy: { $ne: userId } }).sort({
      createdAt: -1,
    });

    // Send the retrieved posts as a response
    res.status(200).json(feedPosts);
  } catch (err) {
    // Handle any errors that occur
    res.status(500).json({ error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to search posts
  const searchPosts = async (req, res) => {
  const { query } = req.query; // Retrieve the search query from the request
  
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    // Perform a case-insensitive search for posts where the text field contains the query
    const posts = await Post.find({
      text: { $regex: query, $options: "i" } // $options: "i" makes the search case-insensitive
    });

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  getFollowingPosts,
  searchPosts,
};
