import type { User, Topic, Assignee, Like, Comment } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic } from "@prisma/client";

export type ExtendedTopic = Topic & {
  assignees: (Assignee & { user: User })[];
  comments: (Comment & { user: User })[];
  user: User;
  likes: Like[];
};

export function getUsers({ userIDs }: { userIDs: string[] }) {
  return prisma.user.findMany({
    where: {
      id: {
        in: userIDs,
      },
    },
  });
}

export function getTopic({ id }: Pick<Topic, "id">) {
  return prisma.topic.findFirst({
    include: {
      likes: true,
      assignees: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
    where: { id },
  });
}
export function getTopicAuthor({ id }: Pick<Topic, "id">) {
  return prisma.topic.findFirst({
    select: { user: { select: { email: true, id: true } } },
    where: { id },
  });
}

export function getTopicListItems({
  query = "",
  sortBy = "newest",
}: {
  query?: string;
  sortBy?: string;
}) {
  return prisma.topic.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      assignees: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
      user: true,
      likes: true,
    },
    orderBy:
      sortBy === "oldest"
        ? { createdAt: "asc" }
        : sortBy === "most-liked"
        ? { likes: { _count: "desc" } }
        : { createdAt: "desc" },
  });
}

export function createTopic({
  description,
  title,
  userId,
}: Pick<Topic, "description" | "title"> & {
  userId: User["id"];
}) {
  return prisma.topic.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTopic({
  id,
  userId,
}: Pick<Topic, "id"> & { userId: User["id"] }) {
  return prisma.topic.deleteMany({
    where: { id, userId },
  });
}
