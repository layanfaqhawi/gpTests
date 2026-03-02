#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <regex>
using namespace std;

class ConceptCard {
    private: 
        string id;
        string term;
        string definition;
        string category;
        vector<string> facts;
        vector<string> keyTerms;
        vector<string> opposites;
        vector<string> relatedTerms;
        vector<pair<string, string>> semanticLinks;
        map<string, vector<string>> placeholders;
        map<string, string> placeholderAnswers;
        map<string, vector<string>> variationPool;

    public:
        ConceptCard() {}

        void setId(const string& id) {
            this->id = id;
        }

        void setTerm(const string& term) {
            this->term = term;
        }

        void setDefinition(const string& definition) {
            this->definition = definition;
        }

        void setCategory(const string& category) {
            this->category = category;
        }

        void setFacts(const vector<string>& facts) {
            for (const auto& fact : facts) {
                this->facts.push_back(fact);
            }
        }

        void setKeyTerms(const vector<string>& keyTerms) {
            for (const auto& keyTerm : keyTerms) {
                this->keyTerms.push_back(keyTerm);
            }
        }

        void setOpposites(const vector<string>& opposites) {
            for (const auto& opposite : opposites) {
                this->opposites.push_back(opposite);
            }
        }

        void setRelatedTerms(const vector<string>& relatedTerms) {
            for (const auto& relatedTerm : relatedTerms) {
                this->relatedTerms.push_back(relatedTerm);
            }
        }

        void setSemanticLinks(const vector<pair<string, string>>& semanticLinks) {
            for (const auto& link : semanticLinks) {
                this->semanticLinks.push_back(link);
            }
        }

        void setPlaceholders(const map<string, vector<string>>& placeholders) {
            for (const auto& pair : placeholders) {
                this->placeholders[pair.first] = pair.second;
            }
        }

        void setPlaceholderAnswers(const map<string, string>& placeholderAnswers) {
            for (const auto& pair : placeholderAnswers) {
                this->placeholderAnswers[pair.first] = pair.second;
            }
        }

        void setVariationPool(const map<string, vector<string>>& variationPool) {
            for (const auto& pair : variationPool) {
                this->variationPool[pair.first] = pair.second;
            }
        }

        string getId() const { return id; }

        string getTerm() const { return term; }

        string getDefinition() const { return definition; }

        string getCategory() const { return category; }

        vector<string> getFacts() const { return facts; }

        vector<string> getKeyTerms() const { return keyTerms; }

        vector<string> getOpposites() const { return opposites; }

        vector<string> getRelatedTerms() const { return relatedTerms; }

        vector<pair<string, string>> getSemanticLinks() const { return semanticLinks; }

        map<string, vector<string>> getPlaceholders() const { return placeholders; }

        map<string, string> getPlaceholderAnswers() const { return placeholderAnswers; }

        map<string, vector<string>> getVariationPool() const { return variationPool; }
};

class trueFalseQuestion {
    private:
        string questionText;
        bool answer;

    public:
        trueFalseQuestion(const string& text, bool ans) : questionText(text), answer(ans) {}

        string getQuestionText() const { return questionText; }

        bool getAnswer() const { return answer; }
};

class fillInTheBlankQuestion {
    private:
        string questionText;
        string answer;

    public:
        fillInTheBlankQuestion(const string& text, const string& ans) : questionText(text), answer(ans) {}

        string getQuestionText() const { return questionText; }

        string getAnswer() const { return answer; }
};

class multipleChoiceQuestion {
    private:
        string questionText;
        vector<string> options;
        int correctOptionIndex;

    public:
        multipleChoiceQuestion(const string& text, const vector<string>& opts, int correctIndex)
            : questionText(text), options(opts), correctOptionIndex(correctIndex) {}

        string getQuestionText() const { return questionText; }

        vector<string> getOptions() const { return options; }

        int getCorrectOptionIndex() const { return correctOptionIndex; }
};

class multiSelectQuestion {
    private:
        string questionText;
        vector<string> options;
        vector<int> correctOptionIndices;

    public:
        multiSelectQuestion(const string& text, const vector<string>& opts, const vector<int>& correctIndices)
            : questionText(text), options(opts), correctOptionIndices(correctIndices) {}

        string getQuestionText() const { return questionText; }

        vector<string> getOptions() const { return options; }

        vector<int> getCorrectOptionIndices() const { return correctOptionIndices; }
};

void printCard(const ConceptCard& c) {
    cout << "== " << c.getTerm() << " (" << c.getId() << ") ==\n";
    cout << "Definition: " << c.getDefinition() << "\n";
    cout << "Category: " << c.getCategory() << "\n";

    cout << "Facts:\n";
    for (const auto& f : c.getFacts()) cout << "  - " << f << "\n";

    cout << "Key terms: ";
    const auto kt = c.getKeyTerms();
    for (size_t i = 0; i < kt.size(); ++i)
        cout << kt[i] << (i + 1 < kt.size() ? ", " : "");
    cout << "\n";

    cout << "Opposites: ";
    const auto op = c.getOpposites();
    for (size_t i = 0; i < op.size(); ++i)
        cout << op[i] << (i + 1 < op.size() ? ", " : "");
    cout << "\n";

    cout << "Related terms: ";
    const auto rt = c.getRelatedTerms();
    for (size_t i = 0; i < rt.size(); ++i)
        cout << rt[i] << (i + 1 < rt.size() ? ", " : "");
    cout << "\n";

    cout << "Semantic links:\n";
    for (const auto& sl : c.getSemanticLinks())
        cout << "  - (" << sl.first << " -> " << sl.second << ")\n";

    cout << "Placeholders:\n";
    for (const auto& kv : c.getPlaceholders()) {
        cout << "  " << kv.first << ": ";
        for (size_t i = 0; i < kv.second.size(); ++i)
            cout << kv.second[i] << (i + 1 < kv.second.size() ? ", " : "");
        cout << "\n";
    }

    cout << "Variation pool:\n";
    for (const auto& kv : c.getVariationPool()) {
        cout << "  " << kv.first << ": ";
        if (kv.second.empty()) { cout << "(none)\n"; continue; }
        cout << "\n";
        for (const auto& v : kv.second) cout << "    - " << v << "\n";
    }
    cout << "\n";
}

ConceptCard completeGraph() {
    ConceptCard card;
    card.setId("graph_complete_v1");
    card.setTerm("complete graph");
    card.setDefinition("a simple undirected graph in which every vertex is connected to each other vertex by a unique edge");
    card.setCategory("graph_type");

    card.setFacts({
        "A complete graph with n vertices has {operator} edges.",
        "A complete graph is always a {graph_type} graph."
    });
    card.setKeyTerms({"every","connected","edge","simple"});
    card.setOpposites({"disconnected graph","incomplete graph"});
    card.setRelatedTerms({"connected graph","dense graph","cyclic graph"});

    card.setSemanticLinks({{"is a","graph"},{"is a supertype of a","connected graph"}});
    card.setPlaceholders({
        {"operator",   {"n(n-1)/2","n-1","n^2","2n"}},
        {"graph_type", {"connected","disconnected","acyclic","cyclic"}}
    });
    card.setPlaceholderAnswers({
        {"operator", "n(n-1)/2"},
        {"graph_type", "connected"}
    });
    card.setVariationPool({
        {"false_formulas",        {"n-1","n^2","2n"}},
        {"related_misconceptions",{
            "A complete graph always has n edges.",
            "Complete graphs can be disconnected.",
            "A complete graph is the same as a tree."
        }}
    });

    return card;
}

//No Semantic links or facts for acyclic graph
ConceptCard acyclicGraph() {
    ConceptCard card;
    card.setId("graph_acyclic_v1");
    card.setTerm("acyclic graph");
    card.setDefinition("a graph that contains no cycles");
    card.setCategory("graph_type");

    card.setFacts({
    });
    card.setKeyTerms({"cycle","no","loop"});
    card.setOpposites({"cyclic graph"});
    card.setRelatedTerms({"tree","DAG","connected graph"});

    card.setSemanticLinks({});
    card.setPlaceholders({
        {"operator",   {"n-1","n","2n","3n+3","log(n)"}},
        {"graph_type", {"acyclic","cyclic","connected","disconnected"}}
    });
    card.setPlaceholderAnswers({
        {"graph_type", "acyclic"}
    });
    card.setVariationPool({
        {"false_formulas", {}},
        {"related_misconceptions",{
            "All acyclic graphs are disconnected.",
            "Acyclic means having exactly one cycle.",
            "Every acyclic graph is a tree."
        }}
    });
    return card;
}

ConceptCard cyclicGraph() {
    ConceptCard card;
    card.setId("graph_cyclic_v1");
    card.setTerm("cyclic graph");
    card.setDefinition("a graph that contains at least one cycle");
    card.setCategory("graph_type");

    card.setFacts({
        "If a graph has a closed path starting and ending at the same vertex, it is {graph_type}.",
        "Every {graph_type} graph is not acyclic.",
        "A {graph_type} graph contains at least {operator} cycle(s)."
    });
    card.setKeyTerms({"cycle","loop","path","closed path"});
    card.setOpposites({"acyclic graph"});
    card.setRelatedTerms({"connected graph","tree","complete graph","DAG"});

    card.setSemanticLinks({{"is a","graph"},{"is the opposite of an","acyclic graph"}});
    card.setPlaceholders({
        {"operator",   {"one","two","zero"}},
        {"graph_type", {"cyclic","acyclic","connected","disconnected","complete"}}
    });
    card.setPlaceholderAnswers({
        {"graph_type", "cyclic"},
        {"operator", "one"}
    });
    card.setVariationPool({
        {"false_formulas", {"two","zero"}},
        {"related_misconceptions",{
            "Every connected graph is cyclic.",
            "Acyclic and cyclic graphs are the same.",
            "All cyclic graphs are complete."
        }}
    });
    return card;
}

//No Semantic links for connected graph
ConceptCard connectedGraph() {
    ConceptCard card;
    card.setId("graph_connected_v1");
    card.setTerm("connected graph");
    card.setDefinition("a graph in which every vertex is reachable from every other vertex");
    card.setCategory("graph_type");

    card.setFacts({
        "Every tree is a {graph_type} graph.",
        "A connected graph on n vertices has at least {operator} edges."
    });
    card.setKeyTerms({"reachable","vertex","path"});
    card.setOpposites({"disconnected graph"});
    card.setRelatedTerms({"tree","cyclic graph","undirected graph","complete graph"});

    card.setSemanticLinks({});
    card.setPlaceholders({
        {"operator",   {"n-1","n","2n","3n+3","log(n)"}},
        {"graph_type", {"connected","disconnected","cyclic","acyclic","complete","tree"}}
    });
    card.setPlaceholderAnswers({
        {"graph_type", "connected"},
        {"operator", "n-1"}
    });
    card.setVariationPool({
        {"false_formulas", {"2n","3n+3","log(n)","n+5"}},
        {"related_misconceptions",{
            "Every tree is a cyclic graph.",
            "A connected graph always has a cycle.",
            "Every connected graph is complete."
        }}
    });
    return card;
}

inline void replaceTokenAll(string& text, const string& key, const string& value) {
    const string token = "{" + key + "}";
    size_t pos = 0;
    while ((pos = text.find(token, pos)) != string::npos) {
        text.replace(pos, token.size(), value);
        pos += value.size();
    }
}

string replacePlaceholder(const string& text, const string& placeholder, const string& answer) {
    string result = text;
    replaceTokenAll(result, placeholder, answer);
    return result;
}

trueFalseQuestion generateTFQuestion(const ConceptCard& card) {
    vector<pair<string, string>> semanticLinks = card.getSemanticLinks();

    if (!semanticLinks.empty()) {
        int randomIndex = rand() % semanticLinks.size();
        string relation = semanticLinks[randomIndex].first;
        string target = semanticLinks[randomIndex].second;

        bool isTrue = (rand() % 2 == 0);

        if (isTrue) {
            string questionStatement = "A/An " + card.getTerm() + " " + relation + " " + target + ".";
            return trueFalseQuestion(questionStatement, true);
        } else {
            string oppositeRelation;
            if (relation == "is a") {
                oppositeRelation = "is not a";
            } else if (relation == "is not a") {
                oppositeRelation = "is a";
            } else if (relation == "is a supertype of a") {
                oppositeRelation = "is not a supertype of a";
            } else if (relation == "is a subtype of a") {
                oppositeRelation = "is not a subtype of a";
            } else if (relation == "is the opposite of an") {
                oppositeRelation = "is not the opposite of an";
            } else {
                oppositeRelation = "is not related to a/an";
            }

            string questionStatement = "A/An " + card.getTerm() + " " + oppositeRelation + " " + target + ".";
            return trueFalseQuestion(questionStatement, false);
        }
    } else {
        vector<string> facts = card.getFacts();
        if (!facts.empty()) {
            int randomIndex = rand() % facts.size();
            string questionStatement = facts[randomIndex];

            bool isTrue = (rand() % 2 == 0);
            if (isTrue) {
                for (auto placeholder: card.getPlaceholderAnswers()) {
                    questionStatement = replacePlaceholder(questionStatement, placeholder.first, placeholder.second);
                }
                return trueFalseQuestion(questionStatement, true);
            } else {
                int randomPlaceholderIndex = rand() % card.getPlaceholders().begin()->second.size();
                for (auto placeholder: card.getPlaceholders()) {
                    questionStatement = replacePlaceholder(questionStatement, placeholder.first, placeholder.second[randomPlaceholderIndex]);
                }
                return trueFalseQuestion(questionStatement, false);
            }
        } else {
            string questionStatement = "A/An " + card.getTerm() + " is defined as: " + card.getDefinition() + ".";
            return trueFalseQuestion(questionStatement, true);
        }
    }
}

int main() {
    ConceptCard complete = completeGraph();
    ConceptCard acyclic = acyclicGraph();
    ConceptCard cyclic = cyclicGraph();
    ConceptCard connected = connectedGraph();

    int numQuestions;
    cout << "Enter number of True/False questions to generate for the quiz: ";
    cin >> numQuestions;

    vector<ConceptCard> cards = {complete, acyclic, cyclic, connected};

    for (int i = 0; i < numQuestions; i++) {
        const ConceptCard& selectedCard = cards[rand() % cards.size()];
        trueFalseQuestion tfQuestion = generateTFQuestion(selectedCard);
        cout << "Q" << (i + 1) << ": " << tfQuestion.getQuestionText()
             << " (Answer: " << (tfQuestion.getAnswer() ? "True" : "False") << ")"
             << " - (" << selectedCard.getTerm() << ")\n";
    }

    return 0;
}