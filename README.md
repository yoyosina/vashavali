# Vanshavali - Secure Digital Family Tree

Vanshavali is an ultra-secure, invite-only digital family tree platform. Map your ancestry, preserve your heritage, and connect generations through an interactive, visually stunning interface.

## 🚀 Features

- **Invite-Only Security**: Trees are completely private. Access requires a secure Family Code and explicit approval from a super-user.
- **Global Profiles**: Users build one master profile and port it seamlessly into any family tree they join.
- **Interactive Tree Layout**: Powered by `dagre` and `React Flow` to cleanly visualize complex pedigrees, marriages, and siblings.
- **Media Galleries & Timelines**: Attach photos, biographies, and chronological life events directly to a member's profile.
- **Mobile Responsive**: Natively responsive for smartphones and tablets.

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Framer Motion (for smooth animations).
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage).
- **Graphing:** `@xyflow/react` and `dagre`.
- **CSS:** Custom CSS with Glassmorphism UI tokens.

## 📦 Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FamilyTree
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 📖 User Guide

### 1. Creating your Global Profile
Before you join any tree, click **Profile** in the navigation bar to set up your master identity. Add your photo, birth date, and biography.

### 2. Joining a Family
On the landing page, enter the **Family Code** provided by your family administrator. Once submitted, your request goes to the "Approvals" dashboard where an admin must accept you before you can view the tree.

### 3. Adding Relatives
Click the **Add Member** button while viewing a tree. You can add a relative as a Child or a Spouse to any existing node. Submitting a new member sends an approval request to the admins.

### 4. Viewing Connections
Click any member's card to view their **Personal Profile**, complete with a media gallery, timeline, and an isolated mini-tree showing their immediate connections.

---
*Built for the preservation of legacy.*
