# # Use Node.js as the base image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all files
# COPY . .

# # Expose port 3000
# EXPOSE 3000

# # Start the app with npm start
# CMD ["npm", "start"]


FROM node:18-alpine
WORKDIR /app
COPY . .
ENV REACT_APP_API_URL=https://api-g3-472.jgogo01.in.th
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
