import { useState, useRef } from 'react'


const SpeechRecognition =()=> {
    const [transcription, setTranscription] = useState([])
	const [finalTranscription, setFinalTranscription] = useState(false)
	const socketRef = useRef(null)

	const handleChange = (e) => {
		setTranscription(e.target.value)
	}
    const handleSubmit = (e) => {
		e.preventDefault()
	
		setFinalTranscription(true)
	}
	const activateMicrophone =  ( )  => {
	
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			if (!MediaRecorder.isTypeSupported('audio/webm'))
				return alert('Browser not supported')
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: 'audio/webm',
			})

		//create a websocket connection
		 const socket = new WebSocket('ws://localhost:3002')
			socket.onopen = () => {
				console.log({ event: 'onopen' })
				mediaRecorder.addEventListener('dataavailable', async (event) => {
					if (event.data.size > 0 && socket.readyState === 1) {
						socket.send(event.data)
					}
				})
				mediaRecorder.start(1000)
			}

			socket.onmessage = (message) => {
				const received = JSON.parse(message.data)
				const transcript = received.channel.alternatives[0].transcript
				if (transcript) {
					console.log(transcript)
                    setTranscription(prevItems => [...prevItems, transcript]);
				}
			}

			socket.onclose = () => {
				console.log({ event: 'onclose' })
			}

			socket.onerror = (error) => {
				console.log({ event: 'onerror', error })
			}

			socketRef.current = socket
		})
		}
		
return(
    <div>

        {!finalTranscription ? (
				<>
					<form onSubmit={handleSubmit}>
                        {/*<textarea
							className="w-full h-80"
							value={transcription}
							onChange={handleChange}
						/>*/}
                        <div>
                            <h2>Transcrição</h2>
                            <div className="text-black">{transcription.join(' ')}</div>
                        </div>
						<br />
                        <button
                            onClick={activateMicrophone}
                            type='button'
                            className="bg-green-500 p-4 rounded-xl text-white">
                            Gravar 
                        </button>

					</form>
				</>
			) : (
				<div>
				</div>
			)}
    </div>
)
}

export default SpeechRecognition
