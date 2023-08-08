import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  if (!params.id) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboardied) redirect("/onboarding");
  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
    </section>
  );
};

export default page;
