# python3 -m uvicorn main:app --reload 
# ngrok http 8000

import json
import os
import base64
import shutil
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
from tavily import TavilyClient
from google import genai
from pydantic import BaseModel
from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# multi-model/client architecture
tts_client = genai.Client(api_key=os.getenv("GOOGLE_AI_STUDIO_KEY"))
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_KEY"))

app = FastAPI()

class TextData(BaseModel):
    message: str

HISTORY_FILE = 'ai_memory.json'

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust this for production security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_history(history):
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2) # Use indent for readability

def search_intent_or_not(user_msg, message_history):
    #return "search" or "general"
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct", #smaller model
        messages=[
            {
                "role": "user",
                "content": "Your job is to sort the sentiment of the following message into two categories, either 'search' or 'general'. Note the capitalization. I am trying to determine whether the following message, which is being sent to a large language model, requires a search query to be answered. For example, a query that may require a search would be 'what is the weather near me like' or 'whats the latest news.' Something that wouldn't require a query would be 'how are you feeling today' or common sense questions. Do not unnecessarily say a question is of type 'search' if the multi-billion-parameter large language model, which is developed by Meta on a huge dataset with lots of common knowledge, should know the answer off the top of its head. For example, a query asking about what Stanford University is would not require a search because it is safe to assume that the model would know what Stanford is along with some general knowledge about it like majors and what type of studies it offers. Depending on the query, you should either say 'search' or 'general', but without any quotation marks or capitalization. Don't say anything else like 'okay here is your message' or the sort. Only say either one of the two words. Here is the message: " + user_msg
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )

    user_message_intent=completion.choices[0].message.content
    model_response = ""

    if user_message_intent == "general": # Model text response
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=message_history, #gotta change this to take in the json file
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None
        )
        model_response=completion.choices[0].message.content
    elif user_message_intent == "search": #search query
        response = tavily.search(
            query=user_msg,
            include_answer="basic",
            search_depth="advanced"
        )
        print(response) # you may want to take tavily's response and make it speak-friendly
        model_response=response["answer"]

    return model_response

messages=[]

def return_text_response(content, request_type, image_query_type, user_location):

    history = load_history()

    model_text_response="Skibidi ding dong" #you KNOW you did something wrong if you hear this
    if request_type == "text": #text query
        history['messages'].append({"role": "user", "content": content})
        model_text_response = search_intent_or_not(content, history['messages'])
    elif request_type == "image": #image uploaded
        base_64_img=content
        model_prompt=""

        if image_query_type=="describe":
            model_prompt="Describe this image to me. I'm a blind person. ONLY Describe the image, don't say any other message like Sure or replying to this message. Solely describe the image."
        else: #simply read text
            model_prompt="Read all the text in this image to me. I'm a blind person. ONLY read the text you see, don't say any other message like Sure or replying to this message. Solely read the text."
        
        history['messages'].append({"role": "user", "content": [{"type": "text", "text": model_prompt}, {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base_64_img}",},},]})
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=history['messages'],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None
        )
        model_text_response=completion.choices[0].message.content #need to save this to json
    elif request_type == "speak": #speech query
        # Transcribe User Input (STT)
        user_text=""
        with open(content, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(content, file.read()),
                model="whisper-large-v3-turbo",
                temperature=0,
                response_format="verbose_json",
            )
            user_text = transcription.text + "If relevant, the user's location is " + user_location
            messages.append({"role": "user", "content": user_text})
        
        history['messages'].append({"role": "user", "content": user_text})
        model_text_response = search_intent_or_not(user_text, history['messages'])

        history['messages'].append({"role": "assistant", "content": model_text_response}) #temporary because I'm lazy
        save_history(history)
        return model_text_response, user_text
        
    history['messages'].append({"role": "assistant", "content": model_text_response})
    save_history(history)
    return model_text_response
        
@app.post("/text-model") #DONe
async def text_model(data: TextData): #DOES
    model_text_response = return_text_response(data.message, "text", None, None)
    return {"model_text_response": model_text_response}

@app.post("/describe-scene") #Done
async def describe_scene(file: UploadFile = File(...)):
    image_path = Path.cwd() / file.filename

    try: # may want to find somewhere else to save these files
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

    model_text_response=return_text_response(base_64_img, "image", "describe", None)

    return {"model_text_response": model_text_response}

@app.post("/read-text") #Done
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
    
    model_text_response=return_text_response(base_64_img, "image", "read", None)

    return {"model_text_response": model_text_response}

@app.post("/speak-with-model") #speak with model
async def speak_with_model(file: UploadFile = File(...), user_location: Annotated[str, Form()] = "No location provided"):

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

    model_text_response, user_text = return_text_response(file_path, "speak", None, user_location)

    return {"model_text_response": model_text_response, "user_text": user_text}

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

    # audio_file = tts_client.files.upload(file=file_path)
    # response = tts_client.models.generate_content(
    #     model='gemini-2.5-flash',
    #     contents=[
    #         "Please transcribe this audio and diarize it by speaker (e.g., Speaker 1, Speaker 2).",
    #         audio_file
    #     ]
    # )
    # print(response.text)

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
    # messages.append({"role": "user", "content": user_text})

    return {"model_text_response": user_text}