import React, { createContext, useContext, useState, useEffect } from "react";
import { cookies } from "../App";

export type User = {
  id: number;
  login: string;
  nick: string;
  IsFormSigned: boolean;
  TFAuth: boolean;
  TFSecret: string;
  secretAscii: string;
  WinCount: number;
  LoseCount: number;
  LatterLevel: number;
  ImageExt: string;
  FriendRequests: FriendRequest[];
  Achievements: Achievements | null;
  Friends: Friend[];
  IgnoredUsers: Ignore[];
  MatchHistory: History[];
  Channels: TChannel[];
};

export type TChannel = {
  id: number;
  Name: string;
  ChannelOwnerID: number;
  AdminIDs: number[];
  BannedIDs: number[];
  MutedIDs: number[];
  InvitedIDs: number[];
  Password: string;
  IsDirect: boolean;
  IsInviteOnly: boolean;
  messages: Message[];
  Users: User[];
};

type Message = {
  id: number;
  message: string;
  senderID: number;
  senderNick: string;
  channelName: string;
  CreatedAt: Date;
};

type FriendRequest = {
  // FriendRequest türüne ait özellikler burada
};

type Achievements = {
  // Achievements türüne ait özellikler burada
};

type Friend = {
  // Friend türüne ait özellikler burada
};

type Ignore = {
  // Ignore türüne ait özellikler burada
};

type History = {
  // History türüne ait özellikler burada
};

// Context'i oluşturun ve başlangıç değeri olarak boş bir nesne kullanın
const ChannelContext = createContext<{
  channelList: TChannel[];
  setChannelList: React.Dispatch<React.SetStateAction<TChannel[]>>;
}>({
  channelList: [],
  setChannelList: () => {},
});

export const UseChannelContext = () => useContext(ChannelContext);

const ChannelProvider = ({ children }) => {
  const [channelList, setChannelList] = useState<TChannel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const responseChannels = await fetch(
        `https://${process.env.REACT_APP_IP}:80/user/channels`,
        {
          headers: {
            authorization: "Bearer " + cookies.get("jwt_authorization"),
            "Content-Type": "application/json",
          },
        }
      );
      const CHs: TChannel[] = await responseChannels.json();
      setChannelList(CHs);
    };
    fetchData();
  }, []);
  return (
    <ChannelContext.Provider value={{ channelList, setChannelList }}>
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelProvider;
