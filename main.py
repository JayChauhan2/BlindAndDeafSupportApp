# python3 -m uvicorn main:app --reload 
# ngrok http 8000

import os
import base64
import shutil
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
from tavily import TavilyClient
from google.genai import Client
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()


tts_client = Client(api_key=os.getenv("GOOGLE_AI_STUDIO_KEY"))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust this for production security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
async def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/describe-scene")
async def describe_scene(file: UploadFile = File(...)):
    image_path = Path.cwd() / file.filename

    try:
        # Open a file in write-binary mode and use the uploaded file's data
        with open(file.filename, "wb") as buffer:
            # Efficiently stream the file in chunks to disk
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        return {"message": f"There was an error uploading the file: {e}"}
    finally:
        # Ensure the temporary file is closed
        await file.close()

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


@app.post("/read-text")
async def read_text(file: UploadFile = File(...)):
    image_path = Path.cwd() / file.filename

    try:
        # Open a file in write-binary mode and use the uploaded file's data
        with open(file.filename, "wb") as buffer:
            # Efficiently stream the file in chunks to disk
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        return {"message": f"There was an error uploading the file: {e}"}
    finally:
        # Ensure the temporary file is closed
        await file.close()

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
                    {"type": "text", "text": "Read all the text in this image to me. I'm a blind person. ONLY read the text you see, don't say any other message like Sure or replying to this message. Solely read the text."},
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

def search_intent_or_not(user_msg):
    #return "search" or "general"
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct", #smaller model
        messages=[
            {
                "role": "user",
                "content": "Your job is to sort the sentiment of the following message into two categories, either 'search' or 'general'. Note the capitalization. I am trying to determine whether the following message requires a search query to be answered. For example, a query that may require a search would be 'what is the weather near me like' or 'whats the latest news.' Something that wouldn't require a query would be 'how are you feeling today.' Depending on the query, you should either say 'search' or 'general', but without any quotation marks or capitalization. Don't say anything else like 'okay here is your message' or the sort. Only either one of the two words. Here is the message: " + user_msg
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )
    model_text_response=completion.choices[0].message.content
    return model_text_response

messages=[]

@app.post("/generate-text-response")
async def generate_response(file: UploadFile = File(...)):

    file_path = os.path.join(Path.cwd(), file.filename)

    try:
        # Open a file in write-binary mode and use the uploaded file's data
        with open(file.filename, "wb+") as buffer:
            # Efficiently stream the file in chunks to disk
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        return {"model_text_response": f"There was an error uploading the file: {e}"}
    finally:
        # Ensure the temporary file is closed
        await file.close()


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
    
    # determine if search worthy
    # check if the returned message turned to lowercase .lower() has the text either search or general in it, and keep retrying till it does
    user_message_intent = search_intent_or_not(user_text)
    print(user_message_intent)
    if user_message_intent == "general":
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
        print(messages)
    else:
        response = tavily.search(
            query=user_text,
            include_answer="basic",
            search_depth="advanced"
        )
        print(response) # you may want to take tavily's response and make it speak-friendly
        model_text_response=response["answer"]
        messages.append({"role": "assistant", "content": model_text_response})
    
    return {"model_text_response": model_text_response}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    
    file_path = os.path.join(Path.cwd(), file.filename)

    try:
        # Open a file in write-binary mode and use the uploaded file's data
        with open(file.filename, "wb+") as buffer:
            # Efficiently stream the file in chunks to disk
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        return {"model_text_response": f"There was an error uploading the file: {e}"}
    finally:
        # Ensure the temporary file is closed
        await file.close()

    audio_file = tts_client.files.upload(file=file_path)
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=[
            "Please transcribe this audio and diarize it by speaker (e.g., Speaker 1, Speaker 2).",
            audio_file
        ]
    )
    print(response.text)
    return {"model_text_response": response.text}