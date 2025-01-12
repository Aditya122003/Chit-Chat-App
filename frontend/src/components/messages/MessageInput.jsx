// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import useSendMessage from "../../hooks/useSendMessage";
const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onEmojiClick = (emojiData) => {
		setMessage((prevMessage) => prevMessage + emojiData.emoji);
	};

  const handleClickOutside = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};
	
	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='relative flex items-center w-full rounded-lg order bg-slate-900'>
			<button
          type="button"
          className="ml-1 mr-2 text-xl text-white"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >😊 
      </button>
			{showEmojiPicker && (
				<div ref={emojiPickerRef} className="absolute bottom-12">
					<EmojiPicker onEmojiClick={onEmojiClick} />
				</div>
			)}

			<input
				type='text'
				className='border-none text-sm rounded-lg block w-full p-2.5 focus:outline-none focus: bg-slate-900 text-white'
				placeholder='Send a message'
				value={message}
				onChange={(e) => {
					setMessage(e.target.value)
				}}
			/>
			<button type='submit' className='absolute inset-y-0 flex items-center text-white end-0 pe-3'>
				{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
			</button>
		</div>
		</form>
	);
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 flex items-center end-0 pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
