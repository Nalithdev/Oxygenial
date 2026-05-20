"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { MessageSquare, Send, Building2 } from "lucide-react";
import { orpc, orpcClient } from "@/lib/orpc-client";
import { verticalFadeIn } from "@/lib/animations";
import { MedicalDashboardLayout } from "../_components/medical-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";

export default function MedicalMessagesPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [content, setContent] = useState("");

  const conversationsQuery = useQuery(orpc.conversation.list.queryOptions({}));

  const messagesQuery = useQuery({
    ...orpc.conversation.listMessages.queryOptions({ input: { conversationId: selectedId! } }),
    enabled: !!selectedId,
  });

  const sendMutation = useMutation({
    mutationFn: () => orpcClient.conversation.sendMessage({ conversationId: selectedId!, content }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: orpc.conversation.listMessages.key() });
      queryClient.invalidateQueries({ queryKey: orpc.conversation.list.key() });
    },
  });

  const selected = conversationsQuery.data?.find((c) => c.id === selectedId);

  return (
    <MedicalDashboardLayout>
      <motion.div {...verticalFadeIn} className="h-[calc(100vh-10rem)] flex gap-4">
        {/* Liste conversations */}
        <div className="w-72 flex-shrink-0 border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-900 text-sm">Messages</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversationsQuery.isPending ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
              </div>
            ) : conversationsQuery.data?.length === 0 ? (
              <div className="text-center py-8 text-slate-400 px-4">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Aucune conversation</p>
              </div>
            ) : (
              conversationsQuery.data?.map((conv) => {
                const last = conv.messages[0];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedId === conv.id ? "bg-emerald-50 border-l-2 border-l-emerald-600" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <p className="font-medium text-slate-900 text-sm truncate">
                        {conv.clientCompany?.name}
                      </p>
                    </div>
                    {last && (
                      <p className="text-xs text-slate-400 truncate pl-5">{last.content}</p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Fenêtre de chat */}
        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <MessageSquare className="w-12 h-12 text-slate-200" />
              <p className="text-sm">Sélectionnez une conversation</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-900 text-sm">
                  {selected?.clientCompany?.name}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messagesQuery.isPending ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                  </div>
                ) : messagesQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Commencez la conversation
                  </div>
                ) : (
                  messagesQuery.data?.map((msg) => {
                    const isMe = msg.senderUserId === session?.user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-emerald-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-900 rounded-bl-sm"}`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-emerald-200" : "text-slate-400"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-slate-100 flex gap-3">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez un message..."
                  rows={2}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (content.trim()) sendMutation.mutate();
                    }
                  }}
                />
                <Button
                  onClick={() => sendMutation.mutate()}
                  disabled={!content.trim() || sendMutation.isPending}
                  className="self-end bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </MedicalDashboardLayout>
  );
}
