import Blog from "../models/blogModel.js";


export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "username");
        res.status(200).json(blogs);
    } catch (error) {
        console.log("Error in getAllBlogs", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "username");
        res.status(200).json(blog);
    } catch (error) {
        console.log("Error in getBlogById", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const createBlog = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const newBlog = new Blog({
            title,
            content,
            image,
            author: req.userId
        });

        await newBlog.save();

        const populatedBlog = await Blog.findById(newBlog._id).populate("author", "username");

        res.status(201).json({ message: "Blog created successfully", blog: populatedBlog });

    } catch (error) {
        console.log("Error in createBlog", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateBlog = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

    
         if (blog.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: You can only edit your own blog" });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.image = image || blog.image;

        await blog.save();


        const populatedBlog = await Blog.findById(blog._id).populate("author", "username");

        res.status(200).json({ message: "Blog updated successfully", blog: populatedBlog });
    } catch (error) {
        console.log("Error in updateBlog", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

    
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        
        if (blog.author?.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own blog" });
        }

        
        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error in deleteBlog", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const userId = req.userId; 


        const alreadyLiked = blog.likes.includes(userId);

        if (alreadyLiked) {
    
            blog.likes = blog.likes.filter(id => id.toString() !== userId);
        } else {
            
            blog.likes.push(userId);
        }

        await blog.save();

        res.status(200).json({ message: alreadyLiked ? "Blog unliked" : "Blog liked", likes: blog.likes.length });
    } catch (error) {
        console.error("Error in likeBlog", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




