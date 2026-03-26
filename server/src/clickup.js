const config = require("./config");

const BASE_URL = "https://api.clickup.com/api/v2";

const headers = {
  Authorization: config.clickupApiToken,
  "Content-Type": "application/json",
};

/**
 * Create a task in ClickUp.
 */
async function createTask({ title, description, priority, tags = [] }) {
  const res = await fetch(`${BASE_URL}/list/${config.clickupListId}/task`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: title,
      description,
      priority,
      tags,
      status: "to do",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ClickUp createTask failed (${res.status}): ${body}`);
  }

  return res.json();
}

/**
 * Add a comment to a ClickUp task.
 */
async function addComment(taskId, commentText) {
  const res = await fetch(`${BASE_URL}/task/${taskId}/comment`, {
    method: "POST",
    headers,
    body: JSON.stringify({ comment_text: commentText }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ClickUp addComment failed (${res.status}): ${body}`);
  }

  return res.json();
}

/**
 * Update a task's status.
 */
async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${BASE_URL}/task/${taskId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ClickUp updateTaskStatus failed (${res.status}): ${body}`);
  }

  return res.json();
}

/**
 * Create multiple tasks from a task breakdown array.
 * Returns array of { task, clickupResponse }.
 */
async function createTasksFromBreakdown(tasks) {
  const results = [];

  for (const task of tasks) {
    const response = await createTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      tags: ["crimson-meta-agent", ...(task.tags || [])],
    });
    results.push({ task, response });
  }

  return results;
}

/**
 * Handle incoming ClickUp webhook events.
 */
function parseWebhookEvent(body) {
  const { event, task_id, history_items } = body;

  if (event === "taskStatusUpdated") {
    const statusChange = history_items?.find((h) => h.field === "status");
    return {
      type: "status_change",
      taskId: task_id,
      newStatus: statusChange?.after?.status,
      oldStatus: statusChange?.before?.status,
    };
  }

  if (event === "taskCommentPosted") {
    const comment = history_items?.find((h) => h.field === "comment");
    return {
      type: "comment",
      taskId: task_id,
      text: comment?.comment?.text_content,
    };
  }

  return { type: event, taskId: task_id };
}

module.exports = {
  createTask,
  addComment,
  updateTaskStatus,
  createTasksFromBreakdown,
  parseWebhookEvent,
};
