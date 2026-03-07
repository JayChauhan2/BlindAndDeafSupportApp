import os
import base64
from dotenv import load_dotenv
from groq import Groq
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust this for production security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
def read_root():
    return {"message": "Hello from FastAPI"}


@app.post("/describe-scene")
def describe_scene(image_path : dict):
    image_path=image_path["signal_data"]
    print("image path is " + image_path)


    if image_path== "None":
        return {"model_text_response": "Please try again."}

    # Function to encode the image
    base_64_img = None
    with open(image_path, "rb") as image_file:
        base_64_img=base64.b64encode(image_file.read()).decode('utf-8')
    
    # Model text response
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Describe this image to me. I'm a blind person. ONLY Describe the image, don't say any other message like Sure or replying to this message. Solely describe the image.?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base_64_img}",
                        },
                    },
                ],
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )
    model_text_response=completion.choices[0].message.content
    return {"model_text_response": model_text_response}

messages=[]

@app.post("/generate-text-response")
def generate_response(file_path: dict):
    print(file_path)
    file_path=file_path["signal_data"]
    if file_path== "None":
        return {"model_text_response": "Please try again."}
    # Transcribe User Input (STT)
    user_text=""
    with open(file_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(file_path, file.read()),
            model="whisper-large-v3-turbo",
            temperature=0,
            response_format="verbose_json",
        )
        user_text = transcription.text
        print("User text-----------")
        print(user_text)
    messages.append({"role": "user", "content": user_text})
    
    # Model text response
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )
    model_text_response=completion.choices[0].message.content
    messages.append({"role": "assistant", "content": model_text_response})
    print("Model response-----------")
    print(model_text_response)

    # speech_file_path = Path(__file__).parent / "speech.wav"
    # response = client.audio.speech.create(
    #     model="canopylabs/orpheus-v1-english",
    #     voice="autumn",
    #     response_format="wav",
    #     input=model_text_response,
    # )
    # print(response)
    # # response.stream_to_file(speech_file_path)
    # response.write_to_file(speech_file_path)
    print(messages)
    return {"model_text_response": model_text_response}
