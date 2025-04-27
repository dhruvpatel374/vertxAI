const axios = require("axios");
const Post = require("../models/post");

const fetchPosts = async () => {
  try {
    // X API v2 (fetch recent posts)
    let xPosts = [];
    try {
      const xResponse = await axios.get(
        "https://api.twitter.com/2/tweets/search/recent?query=news%20lang:en&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username&max_results=10",
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
        }
      );
      if (!xResponse.data?.data) {
        console.warn("X API returned no posts:", xResponse.data);
      } else {
        xPosts = xResponse.data.data.map((tweet) => ({
          source: "x",
          content: tweet.text,
          author: tweet.author_id,
          externalId: tweet.id,
          createdAt: new Date(tweet.created_at),
        }));
        console.log(`Fetched ${xPosts.length} X posts`);
      }
    } catch (xErr) {
      console.error(
        "X API error:",
        xErr.response?.status,
        xErr.response?.data || xErr.message
      );
      if (xErr.response?.status === 429) {
        console.error("X API rate limit exceeded. Try again later.");
      } else if (xErr.response?.status === 401) {
        console.error("X API unauthorized. Check TWITTER_BEARER_TOKEN.");
      }
    }

    // Reddit API (public, no auth)
    let redditPosts = [];
    try {
      const redditResponse = await axios.get(
        "https://www.reddit.com/r/all/top.json?limit=10"
      );
      if (!redditResponse.data.data?.children) {
        console.warn("Reddit API returned no posts:", redditResponse.data);
      } else {
        redditPosts = redditResponse.data.data.children.map((post) => ({
          source: "reddit",
          content: post.data.title,
          author: post.data.author,
          externalId: post.data.id,
          createdAt: new Date(post.data.created * 1000),
        }));
        console.log(`Fetched ${redditPosts.length} Reddit posts`);
      }
    } catch (redditErr) {
      console.error(
        "Reddit API error:",
        redditErr.response?.status,
        redditErr.response?.data || redditErr.message
      );
    }

    // Save posts to MongoDB with upsert to avoid duplicates
    const allPosts = [...xPosts, ...redditPosts];
    if (allPosts.length === 0) {
      console.warn("No posts to save");
      return;
    }

    try {
      let savedCount = 0;
      for (const post of allPosts) {
        const result = await Post.findOneAndUpdate(
          { externalId: post.externalId },
          {
            $set: {
              source: post.source,
              content: post.content,
              author: post.author,
              createdAt: post.createdAt,
              reported: false,
              reportReason: null,
            },
          },
          { upsert: true, new: true }
        );
        if (result) savedCount++;
      }
      console.log(`Saved or updated ${savedCount} posts to MongoDB`);
    } catch (dbErr) {
      console.error("MongoDB error:", dbErr.message);
    }
  } catch (err) {
    console.error("Unexpected error in fetchPosts:", err.message);
  }
};

module.exports = fetchPosts;
