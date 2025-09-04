Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag

Удали кнопку забыли пароль
Произошла ошибка при обращении к модели: Field "messages" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages or coerceable values as input.

Received value: [
  {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "HumanMessage"
    ],
    "kwargs": {
      "content": "Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "invoke": {
      "lc": 1,
      "type": "constructor",
      "id": [
        "langchain_core",
        "messages",
        "AIMessage"
      ],
      "kwargs": {
        "content": "",
        "tool_calls": [
          {
            "id": "6244c6a3-2b72-493d-9da7-ebd5edc6c998",
            "type": "tool_call",
            "function": {
              "name": "rag_search",
              "arguments": "{\"query\":\"пример компонента формы авторизации на react с использованием tailwind css\"}"
            }
          }
        ],
        "invalid_tool_calls": [],
        "additional_kwargs": {},
        "response_metadata": {}
      }
    }
  },
  {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "HumanMessage"
    ],
    "kwargs": {
      "content": "Удали кнопку забыли пароль",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  }
]

Additional message: Unable to coerce message from array: only human, AI, system, developer, or tool message coercion is currently supported.

Received: {
  "invoke": {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "AIMessage"
    ],
    "kwargs": {
      "content": "",
      "tool_calls": [
        {
          "id": "6244c6a3-2b72-493d-9da7-ebd5edc6c998",
          "type": "tool_call",
          "function": {
            "name": "rag_search",
            "arguments": "{\"query\":\"пример компонента формы авторизации на react с использованием tailwind css\"}"
          }
        }
      ],
      "invalid_tool_calls": [],
      "additional_kwargs": {},
      "response_metadata": {}
    }
  }
}

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MESSAGE_COERCION_FAILURE/

Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению
Произошла ошибка при обращении к модели: Field "messages" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages or coerceable values as input.

Received value: [
  {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "HumanMessage"
    ],
    "kwargs": {
      "content": "Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "invoke": {
      "lc": 1,
      "type": "constructor",
      "id": [
        "langchain_core",
        "messages",
        "AIMessage"
      ],
      "kwargs": {
        "content": "",
        "tool_calls": [
          {
            "id": "6244c6a3-2b72-493d-9da7-ebd5edc6c998",
            "type": "tool_call",
            "function": {
              "name": "rag_search",
              "arguments": "{\"query\":\"пример компонента формы авторизации на react с использованием tailwind css\"}"
            }
          }
        ],
        "invalid_tool_calls": [],
        "additional_kwargs": {},
        "response_metadata": {}
      }
    }
  },
  {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "HumanMessage"
    ],
    "kwargs": {
      "content": "Удали кнопку забыли пароль",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "AIMessage"
    ],
    "kwargs": {
      "content": "Произошла ошибка при обращении к модели: Field \"messages\" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages or coerceable values as input.\n\nReceived value: [\n  {\n    \"lc\": 1,\n    \"type\": \"constructor\",\n    \"id\": [\n      \"langchain_core\",\n      \"messages\",\n      \"HumanMessage\"\n    ],\n    \"kwargs\": {\n      \"content\": \"Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag\",\n      \"additional_kwargs\": {},\n      \"response_metadata\": {}\n    }\n  },\n  {\n    \"invoke\": {\n      \"lc\": 1,\n      \"type\": \"constructor\",\n      \"id\": [\n        \"langchain_core\",\n        \"messages\",\n        \"AIMessage\"\n      ],\n      \"kwargs\": {\n        \"content\": \"\",\n        \"tool_calls\": [\n          {\n            \"id\": \"6244c6a3-2b72-493d-9da7-ebd5edc6c998\",\n            \"type\": \"tool_call\",\n            \"function\": {\n              \"name\": \"rag_search\",\n              \"arguments\": \"{\\\"query\\\":\\\"пример компонента формы авторизации на react с использованием tailwind css\\\"}\"\n            }\n          }\n        ],\n        \"invalid_tool_calls\": [],\n        \"additional_kwargs\": {},\n        \"response_metadata\": {}\n      }\n    }\n  },\n  {\n    \"lc\": 1,\n    \"type\": \"constructor\",\n    \"id\": [\n      \"langchain_core\",\n      \"messages\",\n      \"HumanMessage\"\n    ],\n    \"kwargs\": {\n      \"content\": \"Удали кнопку забыли пароль\",\n      \"additional_kwargs\": {},\n      \"response_metadata\": {}\n    }\n  }\n]\n\nAdditional message: Unable to coerce message from array: only human, AI, system, developer, or tool message coercion is currently supported.\n\nReceived: {\n  \"invoke\": {\n    \"lc\": 1,\n    \"type\": \"constructor\",\n    \"id\": [\n      \"langchain_core\",\n      \"messages\",\n      \"AIMessage\"\n    ],\n    \"kwargs\": {\n      \"content\": \"\",\n      \"tool_calls\": [\n        {\n          \"id\": \"6244c6a3-2b72-493d-9da7-ebd5edc6c998\",\n          \"type\": \"tool_call\",\n          \"function\": {\n            \"name\": \"rag_search\",\n            \"arguments\": \"{\\\"query\\\":\\\"пример компонента формы авторизации на react с использованием tailwind css\\\"}\"\n          }\n        }\n      ],\n      \"invalid_tool_calls\": [],\n      \"additional_kwargs\": {},\n      \"response_metadata\": {}\n    }\n  }\n}\n\nTroubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MESSAGE_COERCION_FAILURE/\n",
      "tool_calls": [],
      "invalid_tool_calls": [],
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "HumanMessage"
    ],
    "kwargs": {
      "content": "Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  }
]

Additional message: Unable to coerce message from array: only human, AI, system, developer, or tool message coercion is currently supported.

Received: {
  "invoke": {
    "lc": 1,
    "type": "constructor",
    "id": [
      "langchain_core",
      "messages",
      "AIMessage"
    ],
    "kwargs": {
      "content": "",
      "tool_calls": [
        {
          "id": "6244c6a3-2b72-493d-9da7-ebd5edc6c998",
          "type": "tool_call",
          "function": {
            "name": "rag_search",
            "arguments": "{\"query\":\"пример компонента формы авторизации на react с использованием tailwind css\"}"
          }
        }
      ],
      "invalid_tool_calls": [],
      "additional_kwargs": {},
      "response_metadata": {}
    }
  }
}

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MESSAGE_COERCION_FAILURE/
