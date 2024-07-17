const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const glob = require('glob');

const CHAT_GPT_API_KEY = ''; // Replace with your API key
const sourceDir = path.join(__dirname, '../docs/docs/pages'); // Replace with your documentation folder name '../<docs>/docs/pages'
const targetDir = path.join(__dirname, 'pages_seo');

async function getChatGPTResponse(content, type) {
    let prompt;
    if (type === 'title') {
        prompt = `Generate a concise and specific title for the following content:\n\n${content}`;
    } else if (type === 'description') {
        prompt = `Generate a description for the following content without generalizations and limiting to 280 characters:\n\n${content}`;
    }

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.7,
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
        },
    });

    return response.data.choices[0].message.content.trim();
}

async function processFile(filePath, targetFilePath) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const hasDescription = fileContent.includes('description:');
    const hasTitle = fileContent.includes('title:');

    let newContent = fileContent;

    if (!hasTitle) {
        const title = await getChatGPTResponse(fileContent, 'title');
        newContent = `---
title: ${title}
`;
    }

    if (!hasDescription) {
        let description = await getChatGPTResponse(fileContent, 'description');
        description = description.substring(0, 280); // Limit description to 280 characters
        newContent += `description: ${description}
---\n${fileContent.includes('---', 4) ? '' : '\n'}${fileContent}`;
    }

    await fs.outputFile(targetFilePath, newContent);
}

async function main() {
    try {
        const files = glob.sync(`${sourceDir}/**/*`, { nodir: true });
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            const targetFilePath = path.join(targetDir, path.relative(sourceDir, file));
            await processFile(file, targetFilePath);
            console.log(`Processed ${i + 1}/${totalFiles}: ${file}`);
        }

        console.log('All files processed.');
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

main();